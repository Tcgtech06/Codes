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
      .eq('category', decodedCategory)
      .eq('is_active', true)
      .order('priority', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase fetch error:', error);
      // Return empty array if table doesn't exist yet
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        return NextResponse.json({ companies: [] });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`Found ${data?.length || 0} companies. Sample products:`, data?.[0]?.products);

    // Convert snake_case to camelCase for frontend
    const companies = (data || []).map((company: any) => ({
      id: company.id,
      companyName: company.name,
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
      priority: company.priority,
      isActive: company.is_active,
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
