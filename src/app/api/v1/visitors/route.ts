import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET - Get visitor stats
export async function GET(request: NextRequest) {
  try {
    // Get total visitors count
    const { data: visitorData, error: visitorError } = await supabase
      .from('visitor_stats')
      .select('total_count')
      .eq('id', 'total_visitors')
      .single();

    if (visitorError && visitorError.code !== 'PGRST116') {
      console.error('Error fetching visitor stats:', visitorError);
    }

    const totalVisitors = visitorData?.total_count || 0;

    // Get total companies count
    const { count: companiesCount, error: companiesError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });

    if (companiesError) {
      console.error('Error fetching companies count:', companiesError);
    }

    return NextResponse.json({
      totalVisitors: totalVisitors,
      totalCompanies: companiesCount || 0
    });
  } catch (error: any) {
    console.error('Error in GET /api/v1/visitors:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch visitor stats' },
      { status: 500 }
    );
  }
}

// POST - Increment visitor count
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Check if this session already counted
    const { data: existingSession } = await supabase
      .from('visitor_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();

    if (existingSession) {
      // Session already counted, just return current stats
      const { data: visitorData } = await supabase
        .from('visitor_stats')
        .select('total_count')
        .eq('id', 'total_visitors')
        .single();

      return NextResponse.json({
        totalVisitors: visitorData?.total_count || 0,
        alreadyCounted: true
      });
    }

    // New session - increment counter
    const { data: statsData, error: statsError } = await supabase
      .rpc('increment_visitor_count');

    if (statsError) {
      console.error('Error incrementing visitor count:', statsError);
      throw statsError;
    }

    // Record this session
    await supabase
      .from('visitor_sessions')
      .insert([{
        session_id: sessionId,
        visited_at: new Date().toISOString()
      }]);

    return NextResponse.json({
      totalVisitors: statsData || 0,
      alreadyCounted: false
    });
  } catch (error: any) {
    console.error('Error in POST /api/v1/visitors:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to increment visitor count' },
      { status: 500 }
    );
  }
}
