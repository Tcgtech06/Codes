import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { verifyAdminFromRequest } from '@/lib/serverAuth';
import * as XLSX from 'xlsx';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const APPROVED_EXCEL_BUCKET = process.env.SUPABASE_APPROVED_EXCEL_BUCKET || process.env.SUPABASE_EXCEL_BUCKET || 'uploads';
const APPROVED_EXCEL_PATH = process.env.SUPABASE_APPROVED_EXCEL_PATH || 'excel-files/approved-companies.xlsx';
const APPROVED_EXCEL_SHEET = process.env.SUPABASE_APPROVED_EXCEL_SHEET || 'Companies';
const APPROVED_EXCEL_HEADERS = [
  'COMPANY NAME',
  'CONTACT PERSON',
  'PHONE NUMBER',
  'ADDRESS',
  'E-MAIL ID',
  'WEBSITE',
  'PRODUCTS',
  'GST NUMBER',
  'CATEGORY',
  'APPROVED AT',
];

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

const isStorageNotFoundError = (error: any) => {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('not found') || message.includes('does not exist') || message.includes('404');
};

const resolveApprovedExcelPath = async () => {
  if (process.env.SUPABASE_APPROVED_EXCEL_PATH) {
    return process.env.SUPABASE_APPROVED_EXCEL_PATH;
  }

  const defaultPath = APPROVED_EXCEL_PATH;
  const folder = defaultPath.includes('/') ? defaultPath.split('/').slice(0, -1).join('/') : '';

  const { data: files, error } = await supabase.storage.from(APPROVED_EXCEL_BUCKET).list(folder || '', {
    limit: 100,
    sortBy: { column: 'updated_at', order: 'desc' },
  });

  if (error || !files || files.length === 0) {
    return defaultPath;
  }

  const xlsxFile = files.find((item: any) => typeof item?.name === 'string' && /\.xlsx$/i.test(item.name));
  if (!xlsxFile?.name) {
    return defaultPath;
  }

  return folder ? `${folder}/${xlsxFile.name}` : xlsxFile.name;
};

const appendCompanyToApprovedExcel = async (companyPayload: {
  company_name: string;
  contact_person: string;
  phone: string;
  address: string;
  email: string;
  website: string;
  products: string[];
  gst_number: string;
  category: string;
}) => {
  const approvedExcelPath = await resolveApprovedExcelPath();

  const { data: existingExcel, error: downloadError } = await supabase.storage
    .from(APPROVED_EXCEL_BUCKET)
    .download(approvedExcelPath);

  if (downloadError && !isStorageNotFoundError(downloadError)) {
    throw new Error(`Failed to read approved Excel file: ${downloadError.message}`);
  }

  let workbook = XLSX.utils.book_new();
  let worksheetName = APPROVED_EXCEL_SHEET;

  if (existingExcel && !downloadError) {
    const arrayBuffer = await existingExcel.arrayBuffer();
    const existingWorkbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    workbook = existingWorkbook;

    if (workbook.SheetNames.length > 0) {
      worksheetName = workbook.SheetNames[0] || APPROVED_EXCEL_SHEET;
    }

    if (!workbook.Sheets[worksheetName]) {
      const seededSheet = XLSX.utils.aoa_to_sheet([APPROVED_EXCEL_HEADERS]);
      XLSX.utils.book_append_sheet(workbook, seededSheet, worksheetName);
    }
  } else {
    const seededSheet = XLSX.utils.aoa_to_sheet([APPROVED_EXCEL_HEADERS]);
    XLSX.utils.book_append_sheet(workbook, seededSheet, worksheetName);
  }

  const row = {
    'COMPANY NAME': companyPayload.company_name,
    'CONTACT PERSON': companyPayload.contact_person,
    'PHONE NUMBER': companyPayload.phone,
    'ADDRESS': companyPayload.address,
    'E-MAIL ID': companyPayload.email,
    WEBSITE: companyPayload.website,
    PRODUCTS: companyPayload.products.join(', '),
    'GST NUMBER': companyPayload.gst_number,
    CATEGORY: companyPayload.category,
    'APPROVED AT': new Date().toISOString(),
  };

  XLSX.utils.sheet_add_json(workbook.Sheets[worksheetName], [row], {
    skipHeader: true,
    origin: -1,
  });

  const output = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  const { error: uploadError } = await supabase.storage
    .from(APPROVED_EXCEL_BUCKET)
    .upload(approvedExcelPath, output, {
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to update approved Excel file: ${uploadError.message}`);
  }
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

    await appendCompanyToApprovedExcel(companyPayload);

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
