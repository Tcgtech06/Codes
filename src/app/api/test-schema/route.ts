import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  try {
    // Try to get one company to see the schema
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({ 
        error: error.message,
        details: error 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      sample: data,
      columns: data && data.length > 0 ? Object.keys(data[0]) : []
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
