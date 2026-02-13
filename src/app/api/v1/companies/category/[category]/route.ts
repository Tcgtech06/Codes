import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Convert snake_case to camelCase for frontend
    const companies = (data || []).map(company => ({
      id: company.id,
      companyName: company.company_name,
      contactPerson: company.contact_person,
      email: company.email,
      phone: company.phone,
      website: company.website,
      address: company.address,
      category: company.category,
      description: company.description,
      products: company.products,
      certifications: company.certifications,
      gstNumber: company.gst_number,
      status: company.status,
      createdAt: company.created_at,
      updatedAt: company.updated_at
    }));

    return NextResponse.json({ companies });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
