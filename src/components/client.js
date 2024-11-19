import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://doeablqowbonyptmetza.supabase.co";
const SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvZWFibHFvd2JvbnlwdG1ldHphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODIxOTI4NSwiZXhwIjoyMDQzNzk1Mjg1fQ.5wnCBT_8iP0SkhliKGHNE8Qa54jc9zC0ef0AC0VWkpA";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export { supabase };
