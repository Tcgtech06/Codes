import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { verifyAdminFromRequest } from '@/lib/serverAuth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const normalizeProducts = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  const auth = verifyAdminFromRequest(request);
  if (!auth.isValid) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await params;

    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (submission.type !== 'add-data') {
      return NextResponse.json({ error: 'Only add-data submissions can be approved' }, { status: 400 });
    }

    if (submission.status && submission.status !== 'pending') {
      return NextResponse.json({ error: `Submission is already ${submission.status}` }, { status: 400 });
    }

    const formData = submission.form_data ?? {};

    const companyPayload = {
      company_name: String(formData.companyName || '').trim(),
      category: String(formData.category || '').trim(),
      contact_person: String(formData.contactPerson || '').trim(),
      phone: String(formData.phone || '').trim(),
      address: String(formData.address || '').trim(),
      email: String(formData.email || '').trim(),
      website: String(formData.website || '').trim(),
      description: String(formData.description || '').trim(),
      products: normalizeProducts(formData.products),
      gst_number: String(formData.gstNumber || '').trim(),
      certifications: String(formData.certifications || '').trim(),
      status: 'active',
    };

    if (!companyPayload.company_name || !companyPayload.category || !companyPayload.phone) {
      return NextResponse.json({ error: 'Submission has incomplete company data' }, { status: 400 });
    }

    let createdCompany: { id: string } | null = null;

    const { data: primaryCompany, error: primaryError } = await supabase
      .from('companies')
      .insert([companyPayload])
      .select('*')
      .single();

    if (!primaryError && primaryCompany) {
      createdCompany = primaryCompany;
    } else {
      const fallbackPayload = {
        name: companyPayload.company_name,
        category: companyPayload.category,
        contact_person: companyPayload.contact_person,
        phone: companyPayload.phone,
        address: companyPayload.address,
        email: companyPayload.email,
        website: companyPayload.website,
        description: companyPayload.description,
        products: normalizeProducts(formData.products).join(', '),
        gst_number: companyPayload.gst_number,
        certifications: companyPayload.certifications,
        is_active: true,
      };

      const { data: fallbackCompany, error: fallbackError } = await supabase
        .from('companies')
        .insert([fallbackPayload])
        .select('*')
        .single();

      if (fallbackError || !fallbackCompany) {
        const details = [primaryError?.message, fallbackError?.message].filter(Boolean).join(' | ');
        return NextResponse.json({ error: details || 'Failed to create company from submission' }, { status: 500 });
      }

      createdCompany = fallbackCompany;
    }

    const { error: updateError } = await supabase
      .from('form_submissions')
      .update({
        status: 'approved',
        review_notes: 'Approved and added to companies list',
        approved_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Submission approved and company added successfully',
      companyId: createdCompany?.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
