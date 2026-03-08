import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { verifyAdminFromRequest } from '@/lib/serverAuth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const ATTACHMENTS_BUCKET = process.env.SUPABASE_SUBMISSIONS_BUCKET || 'submission-attachments';

const cleanupSubmissionAttachments = async (attachments: any[]) => {
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
    if (paths.length === 0) {
      continue;
    }

    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) {
      throw new Error(`Failed to cleanup attachments in bucket "${bucket}": ${error.message}`);
    }
  }
};

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = verifyAdminFromRequest(request);
  if (!auth.isValid) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await params;

    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .select('id, attachments')
      .eq('id', id)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const attachments = Array.isArray(submission.attachments) ? submission.attachments : [];
    await cleanupSubmissionAttachments(attachments);

    const { error: deleteError } = await supabase
      .from('form_submissions')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Submission deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
