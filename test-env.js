// Test if env vars are loaded
console.log('Environment check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');

// Show first 20 chars of keys (safe to display)
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('Service key starts with:', process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20));
}
