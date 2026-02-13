import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import supabase from '@/lib/supabase';

export async function POST(request: NextRequest) {
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

    const companies = [];
    const errors = [];

    for (let i = 0; i < jsonData.length; i++) {
      const row: any = jsonData[i];
      
      // Map column names (handle different formats)
      // Column A: Company Name
      const companyName = row['COMPANY NAME'] || row['Company Name'] || row['company_name'] || 
                         row['CompanyName'] || row['A'] || '';
      
      // Column B: Contact Person  
      const contactPerson = row['CONTACT PERSON'] || row['Contact Person'] || row['contact_person'] || 
                           row['ContactPerson'] || row['B'] || '';
      
      // Column C: Phone Number
      const phone = row['PHONE NUMBER'] || row['Phone Number'] || row['phone'] || 
                   row['PhoneNumber'] || row['C'] || '';
      
      // Column D: Address
      const address = row['ADDRESS'] || row['Address'] || row['address'] || row['D'] || '';
      
      // Column E: Email
      const email = row['E-MAIL ID'] || row['Email'] || row['email'] || row['E'] || '';
      
      // Column F: Website
      const website = row['WEBSITE'] || row['Website'] || row['website'] || row['F'] || '';
      
      // Column G: Products/Services
      const products = row['PRODUCTS'] || row['Products'] || row['products'] || 
                      row['SERVICES'] || row['Services'] || row['G'] || '';
      
      // Column H: GST Number
      const gstNumber = row['GST NUMBER'] || row['GST No'] || row['gst_number'] || row['H'] || '';

      if (!companyName) {
        errors.push(`Row ${i + 2}: Company name is required`);
        continue;
      }

      // Clean phone number (truncate to 50 chars)
      const cleanPhone = phone ? String(phone).substring(0, 50) : '';

      companies.push({
        company_name: companyName,
        category: category,
        contact_person: contactPerson || null,
        phone: cleanPhone || null,
        address: address || null,
        email: email || null,
        website: website || null,
        products: products ? (Array.isArray(products) ? products : [products]) : [],
        gst_number: gstNumber || null,
        status: 'active',
        created_at: new Date().toISOString()
      });
    }

    if (companies.length === 0) {
      return NextResponse.json({
        success: false,
        errors: errors.length > 0 ? errors : ['No valid data found in Excel file']
      }, { status: 400 });
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
      message: `Successfully processed ${companies.length} companies`,
      count: companies.length,
      companies: data,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error: any) {
    console.error('Excel parse error:', error);
    return NextResponse.json({
      success: false,
      errors: [error.message]
    }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
