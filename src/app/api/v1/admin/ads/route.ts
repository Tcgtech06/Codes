import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { uploadAdImage } from '@/lib/storage';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!;

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = searchParams.get('page');
    const all = searchParams.get('all') === 'true'; // If true, return inactive as well
    
    let query = supabase.from('ads').select('*').order('created_at', { ascending: false });
    
    if (type) query = query.eq('type', type);
    if (page) query = query.eq('page', page);
    if (!all) query = query.eq('is_active', true);
    
    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ ads: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!adminUser) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const formData = await request.formData();
    const type = formData.get('type') as string;
    const page = formData.get('page') as string;
    const redirection_url = formData.get('redirection_url') as string;
    const whatsapp_number = formData.get('whatsapp_number') as string;
    const imageFile = formData.get('image') as File;

    if (!type || !page || !imageFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload image
    const imageUrl = await uploadAdImage(imageFile, type);
    if (!imageUrl) {
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    const newAd = {
      type,
      page,
      image_url: imageUrl,
      redirection_url: redirection_url || null,
      whatsapp_number: whatsapp_number || null,
      is_active: true
    };

    const { data, error } = await supabase
      .from('ads')
      .insert([newAd])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ad: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
