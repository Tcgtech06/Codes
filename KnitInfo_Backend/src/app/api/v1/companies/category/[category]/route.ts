import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category);
    
    console.log('Fetching companies for category:', decodedCategory);
    
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .ilike('category', decodedCategory)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`Found ${data?.length || 0} companies. Sample products:`, data?.[0]?.products);

    // Convert snake_case to camelCase for frontend
    const companies = (data || []).map((company: any) => ({
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

    console.log('Returning companies with products. First company products:', companies[0]?.products);

    return NextResponse.json({ companies });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
