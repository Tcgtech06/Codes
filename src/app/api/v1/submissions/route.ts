import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { verifyAdminFromRequest } from '@/lib/serverAuth';
import { uploadBase64Image } from '@/lib/storage';

const ALLOWED_TYPES = ['add-data', 'advertise', 'collaborate'] as const;

const toSubmissionDto = (row: any) => ({
  id: row.id,
  type: row.type,
  userId: row.user_id,
  formData: row.form_data ?? row.formData ?? {},
  attachments: row.attachments ?? [],
  status: row.status ?? 'pending',
  reviewNotes: row.review_notes ?? null,
  submittedAt: row.submitted_at ?? row.created_at ?? new Date().toISOString(),
});

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

    return NextResponse.json({ submissions: (data || []).map(toSubmissionDto) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const type = body?.type;
    const userId = body?.userId;
    const formData = body?.formData;
    const attachments = Array.isArray(body?.attachments) ? body.attachments : [];

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

    // Process attachments - upload base64 images to storage
    const processedAttachments = [];
    for (const attachment of attachments) {
      console.log('Processing attachment:', attachment.name, 'purpose:', attachment.purpose);
      
      if (attachment.data && typeof attachment.data === 'string' && attachment.data.startsWith('data:')) {
        console.log('Uploading base64 image to storage...');
        
        // Upload base64 image to storage
        const publicUrl = await uploadBase64Image(
          attachment.data,
          attachment.name,
          submissionData.id
        );

        if (publicUrl) {
          console.log('Upload successful, URL:', publicUrl);
          processedAttachments.push({
            name: attachment.name,
            type: attachment.type,
            size: attachment.size,
            purpose: attachment.purpose,
            url: publicUrl, // Store URL instead of base64
          });
        } else {
          // If upload fails, store metadata without data
          console.error('Upload failed for:', attachment.name);
          processedAttachments.push({
            name: attachment.name,
            type: attachment.type,
            size: attachment.size,
            purpose: attachment.purpose,
            error: 'Failed to upload to storage',
          });
        }
      } else {
        // Keep attachment as is if it's not base64
        console.log('Keeping attachment as-is (not base64)');
        processedAttachments.push(attachment);
      }
    }
    
    console.log('Processed attachments:', processedAttachments.length);

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
        submission: toSubmissionDto({ ...submissionData, attachments: processedAttachments }) 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in POST /submissions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
