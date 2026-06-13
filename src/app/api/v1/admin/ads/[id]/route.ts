import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!;

import { verifyAdminFromRequest } from '@/lib/serverAuth';

async function verifyAdmin(request: NextRequest) {
  const authResult = verifyAdminFromRequest(request);
  if (!authResult.isValid) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await verifyAdmin(request);
    if (!supabase) {
      return NextResponse.json({ error: 'Unauthorized or Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Ad deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await verifyAdmin(request);
    if (!supabase) {
      return NextResponse.json({ error: 'Unauthorized or Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('ads')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ad: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
