import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { verifyAdminFromRequest } from '@/lib/serverAuth';

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

    const insertPayload = {
      type,
      user_id: userId || null,
      form_data: formData,
      attachments,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('form_submissions')
      .insert([insertPayload])
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Submission created successfully', submission: toSubmissionDto(data) },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
