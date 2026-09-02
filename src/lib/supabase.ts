import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gmoaftfmgaotymanzhwf.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtb2FmdGZtZ2FvdHltYW56aHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyODAwOTIsImV4cCI6MjEwMzg1NjA5Mn0.qi6DaLq1kOwcm4WNoLSmBKQIhT18qlDMgRgA4GclyKA";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
