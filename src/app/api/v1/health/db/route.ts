import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  try {
    // Try to query the database to check connection
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .limit(1);

    if (error) {
      // Check if it's a configuration error
      if (error.message.includes('not configured')) {
        return NextResponse.json({
          connected: false,
          database: 'Supabase',
          error: 'Database not configured'
        });
      }
      
      return NextResponse.json({
        connected: false,
        database: 'Supabase',
        error: error.message
      });
    }

    return NextResponse.json({
      connected: true,
      database: 'Supabase',
      message: 'Database connected successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      database: 'Supabase',
      error: error.message || 'Unknown error'
    });
  }
}
