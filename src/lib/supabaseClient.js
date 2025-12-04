import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cisfzmzssszldaueuovi.supabase.co';
const supabaseAnonKey = 'sb_publishable_m4jNDD2MJTeU-0uvZRxskg_gecbuoQf';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);