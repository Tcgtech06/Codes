import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { verifyAdminFromRequest } from '@/lib/serverAuth';

const ALLOWED_TYPES = ['add-data', 'advertise', 'collaborate'] as const;
const ATTACHMENTS_BUCKET = process.env.SUPABASE_SUBMISSIONS_BUCKET || 'submission-attachments';

const sanitizeFileName = (fileName: string): string =>
  fileName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .toLowerCase();

const uploadDataUrlAttachment = async (
  dataUrl: string,
  fileName: string,
  submissionId: string,
  type: string,
  bucket: string
) => {
  const matches = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  if (!matches) {
    return null;
  }

  const mimeType = matches[1] || 'application/octet-stream';
  const base64Data = matches[2];
  const fileBuffer = Buffer.from(base64Data, 'base64');

  const safeName = sanitizeFileName(fileName || 'attachment');
  const objectPath = `${type}/${submissionId}-${Date.now()}-${crypto.randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, fileBuffer, {
    contentType: mimeType,
    upsert: false,
  });

  if (uploadError) {
    return null;
  }

  return {
    bucket,
    path: objectPath,
    type: mimeType,
  };
};

const createSignedAttachmentUrl = async (attachment: any) => {
  if (!attachment || typeof attachment !== 'object') {
    return attachment;
  }

  if (!attachment.path) {
    return attachment;
  }

  const bucket = attachment.bucket || ATTACHMENTS_BUCKET;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(attachment.path, 60 * 60 * 6);

  if (error) {
    // Preserve existing URL when signing fails, instead of dropping image access.
    return {
      ...attachment,
      signedUrl: attachment.signedUrl || attachment.url || null,
      url: attachment.url || null,
    };
  }

  return {
    ...attachment,
    signedUrl: data?.signedUrl || attachment.signedUrl || attachment.url || null,
    // Always refresh signed URL so expired links in DB do not break admin preview.
    url: data?.signedUrl || attachment.url || null,
  };
};

const toSubmissionDto = async (row: any) => {
  const rawAttachments = Array.isArray(row.attachments) ? row.attachments : [];
  const attachments = await Promise.all(rawAttachments.map((item: any) => createSignedAttachmentUrl(item)));

  return {
    id: row.id,
    type: row.type,
    userId: row.user_id ?? null,
    formData: row.form_data ?? row.formData ?? {},
    attachments,
    status: row.status ?? 'pending',
    reviewNotes: row.review_notes ?? null,
    submittedAt: row.submitted_at ?? row.created_at ?? new Date().toISOString(),
  };
};

export async function GET(request: NextRequest) {
  const auth = verifyAdminFromRequest(request);
  if (!auth.isValid) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let query = supabase
      .from('form_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (type) query = query.eq('type', type);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const submissions = await Promise.all((data || []).map((row) => toSubmissionDto(row)));
    return NextResponse.json({ submissions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let type: string | undefined;
    let userId: string | null = null;
    let formData: Record<string, any> | undefined;
    let attachments: any[] = [];

    if (contentType.includes('multipart/form-data')) {
      const multipart = await request.formData();
      type = String(multipart.get('type') || '');
      const rawUserId = multipart.get('userId');
      userId = rawUserId ? String(rawUserId) : null;

      const rawFormData = multipart.get('formData');
      const rawAttachments = multipart.get('attachments');
      formData = rawFormData ? JSON.parse(String(rawFormData)) : undefined;
      attachments = rawAttachments ? JSON.parse(String(rawAttachments)) : [];

      const visitingCard = multipart.get('visitingCard');
      if (visitingCard && visitingCard instanceof File && visitingCard.size > 0) {
        const safeName = sanitizeFileName(visitingCard.name || 'visiting-card');
        const objectPath = `${type}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from(ATTACHMENTS_BUCKET)
          .upload(objectPath, visitingCard, {
            contentType: visitingCard.type || 'application/octet-stream',
            upsert: false,
          });

        if (uploadError) {
          return NextResponse.json({ error: `Failed to upload visiting card: ${uploadError.message}` }, { status: 500 });
        }

        attachments = [
          ...attachments,
          {
            name: visitingCard.name,
            type: visitingCard.type,
            size: visitingCard.size,
            purpose: 'visiting-card',
            bucket: ATTACHMENTS_BUCKET,
            path: objectPath,
          },
        ];
      }
    } else {
      const body = await request.json();
      type = body?.type;
      userId = body?.userId ? String(body.userId) : null;
      formData = body?.formData;
      attachments = Array.isArray(body?.attachments) ? body.attachments : [];
    }

    if (!type || !ALLOWED_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Invalid submission type' }, { status: 400 });
    }

    if (!formData || typeof formData !== 'object') {
      return NextResponse.json({ error: 'Form data is required' }, { status: 400 });
    }

    // First, insert the submission to get an ID
    const insertPayload = {
      type,
      user_id: userId || null,
      form_data: formData,
      attachments: [], // Will update after uploading images
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };

    const { data: submissionData, error: insertError } = await supabase
      .from('form_submissions')
      .insert([insertPayload])
      .select('*')
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Process attachments and persist all image files in Storage.
    const processedAttachments = [];
    for (const attachment of attachments) {
      if (attachment.data && typeof attachment.data === 'string' && attachment.data.startsWith('data:')) {
        const uploaded = await uploadDataUrlAttachment(
          attachment.data,
          attachment.name || 'attachment',
          submissionData.id,
          type,
          ATTACHMENTS_BUCKET
        );

        if (uploaded) {
          processedAttachments.push({
            name: attachment.name,
            type: attachment.type || uploaded.type,
            size: attachment.size,
            purpose: attachment.purpose,
            bucket: uploaded.bucket,
            path: uploaded.path,
          });
        } else {
          processedAttachments.push({
            name: attachment.name,
            type: attachment.type,
            size: attachment.size,
            purpose: attachment.purpose,
            error: 'Failed to upload to storage',
          });
        }
      } else {
        processedAttachments.push(attachment);
      }
    }

    // Update submission with processed attachments
    if (processedAttachments.length > 0) {
      const { error: updateError } = await supabase
        .from('form_submissions')
        .update({ attachments: processedAttachments })
        .eq('id', submissionData.id);

      if (updateError) {
        console.error('Error updating attachments:', updateError);
      }
    }

    return NextResponse.json(
      {
        message: 'Submission created successfully',
        submission: await toSubmissionDto({ ...submissionData, attachments: processedAttachments }),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in POST /submissions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
