import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    'https://xahxnpbplibmqquyzvek.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhucGJwbGlibXFxdXl6dmVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzYwMDEsImV4cCI6MjA2MzMxMjAwMX0.Y0RMhGxqiKDcVvAUO5jhID3-M8oN3eKvuXzByp7R1ok'
)
