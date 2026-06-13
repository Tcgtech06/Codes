import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createNotification } from '@/lib/notifications';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!;

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ companies: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { verifyAdminFromRequest } from '@/lib/serverAuth';

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyAdminFromRequest(request);
    if (!authResult.isValid) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    // using 'admin' as a fallback if payload is not fully structured, but user ID is not strictly required here.
    const createdBy = authResult.payload?.username || 'admin';

    const body = await request.json();
    const { data, error } = await supabase
      .from('companies')
      .insert([{ ...body, created_by: createdBy }])
      .select()
      .single();

    if (error) throw error;

    await createNotification(`New company "${body.name}" has been added`, 'create');

    return NextResponse.json({ company: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
