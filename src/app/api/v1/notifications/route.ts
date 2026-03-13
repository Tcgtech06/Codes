import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ notifications: [] });
    }

    // Convert snake_case to camelCase
    const notifications = (data || []).map((notification: any) => ({
      id: notification.id,
      userId: notification.user_id,
      type: notification.type,
      message: notification.message,
      read: notification.read,
      createdAt: notification.created_at,
      updatedAt: notification.updated_at
    }));

    return NextResponse.json({ notifications });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ notifications: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, message, read = false } = body;

    if (!userId || !type || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, type, message' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        message,
        read,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Notification created successfully',
      notification: {
        id: data.id,
        userId: data.user_id,
        type: data.type,
        message: data.message,
        read: data.read,
        createdAt: data.created_at
      }
    });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
