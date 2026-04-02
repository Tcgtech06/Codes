import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { verifyAdminFromRequest } from '@/lib/serverAuth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const ATTACHMENTS_BUCKET = process.env.SUPABASE_SUBMISSIONS_BUCKET || 'submission-attachments';

const sanitizeFileName = (fileName: string): string =>
  fileName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .toLowerCase();

const cleanupOldVisitingCardFiles = async (attachments: any[]) => {
  const filesByBucket = new Map<string, string[]>();

  for (const item of attachments) {
    if (!item || typeof item !== 'object' || !item.path) {
      continue;
    }

    const bucket = typeof item.bucket === 'string' && item.bucket ? item.bucket : ATTACHMENTS_BUCKET;
    const existing = filesByBucket.get(bucket) || [];
    filesByBucket.set(bucket, [...existing, item.path]);
  }

  for (const [bucket, paths] of filesByBucket.entries()) {
    if (paths.length === 0) continue;
    await supabase.storage.from(bucket).remove(paths);
  }
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  const auth = verifyAdminFromRequest(request);
  if (!auth.isValid) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await params;
    const payload = await request.formData();
    const visitingCard = payload.get('visitingCard');

    if (!(visitingCard instanceof File) || visitingCard.size === 0) {
      return NextResponse.json({ error: 'Visiting card file is required' }, { status: 400 });
    }

    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .select('id, type, form_data, attachments')
      .eq('id', id)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const safeName = sanitizeFileName(visitingCard.name || 'visiting-card');
    const objectPath = `${submission.type || 'submission'}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(ATTACHMENTS_BUCKET)
      .upload(objectPath, visitingCard, {
        contentType: visitingCard.type || 'application/octet-stream',
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: `Failed to upload visiting card: ${uploadError.message}` }, { status: 500 });
    }

    const existingAttachments = Array.isArray(submission.attachments) ? submission.attachments : [];
    const oldVisitingCards = existingAttachments.filter((item: any) => item?.purpose === 'visiting-card');
    const nonVisitingAttachments = existingAttachments.filter((item: any) => item?.purpose !== 'visiting-card');

    await cleanupOldVisitingCardFiles(oldVisitingCards);

    const nextAttachments = [
      ...nonVisitingAttachments,
      {
        name: visitingCard.name,
        type: visitingCard.type,
        size: visitingCard.size,
        purpose: 'visiting-card',
        bucket: ATTACHMENTS_BUCKET,
        path: objectPath,
      },
    ];

    const nextFormData = {
      ...(submission.form_data || {}),
      visitingCardName: visitingCard.name,
      visitingCardRepairedAt: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('form_submissions')
      .update({
        attachments: nextAttachments,
        form_data: nextFormData,
      })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Visiting card updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
