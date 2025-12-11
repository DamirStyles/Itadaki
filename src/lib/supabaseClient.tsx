import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = 'https://cisfzmzssszldaueuovi.supabase.co';
const supabaseAnonKey = 'sb_publishable_m4jNDD2MJTeU-0uvZRxskg_gecbuoQf';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);