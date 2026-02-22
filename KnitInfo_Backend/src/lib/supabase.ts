import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

const createMisconfiguredClient = () => {
  const message =
    'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.';

  return new Proxy(
    {},
    {
      get() {
        throw new Error(message);
      },
    }
  ) as any;
};

// Create Supabase client with schema options to use snake_case
export const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        db: {
          schema: 'public',
        },
        auth: {
          persistSession: false,
        },
      })
    : createMisconfiguredClient();

export default supabase;
