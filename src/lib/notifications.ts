import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function createNotification(message: string, type: 'update' | 'create' | 'delete') {
  try {
    await supabase.from('notifications').insert({
      message,
      type,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}
