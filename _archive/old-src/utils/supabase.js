import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check BEFORE creating client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables!');
  console.error('URL:', supabaseUrl);
  console.error('Key:', supabaseAnonKey ? 'EXISTS' : 'MISSING');
  throw new Error('Missing Supabase environment variables! Check your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    const { error } = await supabase
      .from('products')
      .select('count');
    
    if (error) {
      console.error('Supabase test FAILED:', error);
      return false;
    }
    
    console.log('Supabase test SUCCESS!');
    return true;
  } catch (err) {
    console.error('Supabase test ERROR:', err);
    return false;
  }
};