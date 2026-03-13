import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET - Get active visitors count
export async function GET(request: NextRequest) {
  try {
    // Get active sessions from last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: activeSessions, error } = await supabase
      .from('visitor_sessions')
      .select('session_id')
      .gte('visited_at', fiveMinutesAgo);

    if (error) {
      console.error('Error fetching active sessions:', error);
      return NextResponse.json({ activeCount: 0 }, { status: 200 });
    }

    const activeCount = activeSessions?.length || 0;

    return NextResponse.json({
      activeCount: activeCount
    });
  } catch (error: any) {
    console.error('Error in GET /api/v1/visitors/active:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch active visitors' },
      { status: 500 }
    );
  }
}

// POST - Update session activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Update or insert session activity
    const { error } = await supabase
      .from('visitor_sessions')
      .upsert({
        session_id: sessionId,
        visited_at: new Date().toISOString()
      }, {
        onConflict: 'session_id'
      });

    if (error) {
      console.error('Error updating session activity:', error);
      throw error;
    }

    // Get current active count
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: activeSessions } = await supabase
      .from('visitor_sessions')
      .select('session_id')
      .gte('visited_at', fiveMinutesAgo);

    const activeCount = activeSessions?.length || 0;

    return NextResponse.json({
      activeCount: activeCount,
      updated: true
    });
  } catch (error: any) {
    console.error('Error in POST /api/v1/visitors/active:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update session activity' },
      { status: 500 }
    );
  }
}
