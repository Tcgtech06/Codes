import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import supabase from '@/lib/supabase';
import { verifyAdminFromRequest } from '@/lib/serverAuth';

const getValue = (row: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value).trim();
    }
  }

  return '';
};

const normalizeProducts = (value: string): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export async function POST(request: NextRequest) {
  const auth = verifyAdminFromRequest(request);
  if (!auth.isValid) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Read file buffer
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const companies = [] as Array<Record<string, unknown>>;
    const errors: string[] = [];

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i] as Record<string, unknown>;

      const companyName = getValue(row, ['COMPANY NAME', 'Company Name', 'company_name', 'CompanyName', 'A', 'NAME']);
      const contactPerson = getValue(row, ['CONTACT PERSON', 'Contact Person', 'contact_person', 'ContactPerson', 'B', 'CONTACT']);
      const phone = getValue(row, ['PHONE NUMBER', 'Phone Number', 'phone', 'PhoneNumber', 'C', 'NUMBER']);
      const address = getValue(row, ['ADDRESS', 'Address', 'address', 'D']);
      const email = getValue(row, ['E-MAIL ID', 'EMAIL ID', 'Email', 'email', 'E', 'MAIL ID']);
      const website = getValue(row, ['WEBSITE', 'Website', 'website', 'F', 'WEB SITE', 'URL']);
      const productsRaw = getValue(row, ['PRODUCTS', 'Products', 'products', 'SERVICES', 'Services', 'G', 'PRODUCT']);
      const gstNumber = getValue(row, ['GST NUMBER', 'GST No', 'gst_number', 'H', 'GST']);

      if (!companyName) {
        errors.push(`Row ${i + 2}: Company name is required`);
        continue;
      }

      // Clean phone number (truncate to 50 chars)
      const cleanPhone = phone ? String(phone).substring(0, 50) : '';

      companies.push({
        company_name: companyName,
        category: category,
        contact_person: contactPerson || '',
        phone: cleanPhone || '',
        address: address || '',
        email: email || '',
        website: website || '',
        description: '',
        products: normalizeProducts(productsRaw),
        gst_number: gstNumber || '',
        certifications: '',
        status: 'active'
      });
    }

    if (companies.length === 0) {
      return NextResponse.json({
        success: false,
        errors: errors.length > 0 ? errors : ['No valid data found in Excel file']
      }, { status: 400 });
    }

    const { data: existingCompanies, error: existingError } = await supabase
      .from('companies')
      .select('id')
      .eq('category', category);

    if (existingError) {
      return NextResponse.json({ success: false, errors: [existingError.message] }, { status: 500 });
    }

    const existingCount = existingCompanies?.length || 0;

    if (existingCount > 0) {
      const { error: deleteError } = await supabase
        .from('companies')
        .delete()
        .eq('category', category);

      if (deleteError) {
        return NextResponse.json({ success: false, errors: [deleteError.message] }, { status: 500 });
      }
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('companies')
      .insert(companies)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({
        success: false,
        errors: [error.message]
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully replaced ${category} data`,
      count: companies.length,
      existingDeleted: existingCount,
      companies: data,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Excel parse error:', error);
    return NextResponse.json({
      success: false,
      errors: [errorMessage]
    }, { status: 500 });
  }
}
