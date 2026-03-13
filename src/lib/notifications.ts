import { createClient } from '@supabase/supabase-js';

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase admin credentials are missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY).'
    );
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function createNotification(message: string, type: 'update' | 'create' | 'delete') {
  try {
    const supabase = getSupabaseAdminClient();

    await supabase.from('notifications').insert({
      message,
      type,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}
