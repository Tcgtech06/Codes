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

import { uploadAdImage } from '@/lib/storage';

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
    const contentType = request.headers.get('content-type') || '';
    let updateData: any = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const type = formData.get('type') as string;
      if (type) updateData.type = type;
      
      const page = formData.get('page') as string;
      if (page) updateData.page = page;
      
      const redirection_url = formData.get('redirection_url') as string;
      if (redirection_url !== null) updateData.redirection_url = redirection_url;
      
      const whatsapp_number = formData.get('whatsapp_number') as string;
      if (whatsapp_number !== null) updateData.whatsapp_number = whatsapp_number;
      
      const imageFile = formData.get('image') as File | null;
      if (imageFile) {
        const imageUrl = await uploadAdImage(imageFile, updateData.type || 'hero');
        if (imageUrl) {
          updateData.image_url = imageUrl;
        }
      }
    } else {
      updateData = await request.json();
    }

    const { data, error } = await supabase
      .from('ads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ad: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
