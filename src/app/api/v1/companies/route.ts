import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let query = supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`company_name.ilike.%${search}%,contact_person.ilike.%${search}%`);
    }

    const { data, error } = await query;

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Convert camelCase to snake_case for Supabase
    const companyData = {
      company_name: body.companyName || body.company_name,
      category: body.category,
      contact_person: body.contactPerson || body.contact_person || '', // Empty string instead of null
      phone: body.phone || '',
      address: body.address || '',
      email: body.email || '',
      website: body.website || '',
      description: body.description || '',
      products: body.products || [],
      gst_number: body.gstNumber || body.gst_number || '',
      certifications: body.certifications || '',
      status: body.status || 'active'
    };

    console.log('Creating company with products:', companyData.company_name, 'Products:', companyData.products);

    const { data, error } = await supabase
      .from('companies')
      .insert([companyData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Company created successfully. Products in DB:', data.products);

    // Convert snake_case to camelCase for frontend
    const company = {
      id: data.id,
      companyName: data.company_name,
      contactPerson: data.contact_person,
      email: data.email,
      phone: data.phone,
      website: data.website,
      address: data.address,
      category: data.category,
      description: data.description,
      products: data.products,
      certifications: data.certifications,
      gstNumber: data.gst_number,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    return NextResponse.json({ company }, { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
