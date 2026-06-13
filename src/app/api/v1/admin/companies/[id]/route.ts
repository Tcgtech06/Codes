import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createNotification } from '@/lib/notifications';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!;

import { verifyAdminFromRequest } from '@/lib/serverAuth';

async function verifyAdmin(request: NextRequest) {
  const authResult = verifyAdminFromRequest(request);
  if (!authResult.isValid) return null;
  return authResult.payload?.username || 'admin';
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('companies')
      .update({ ...body, updated_by: user || 'admin' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await createNotification(`Company "${data.name}" has been updated`, 'update');

    return NextResponse.json({ company: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: company } = await supabase
      .from('companies')
      .select('name')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (company) {
      await createNotification(`Company "${company.name}" has been deleted`, 'delete');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
