-- Disable Row Level Security on all tables in the public schema
-- WARNING: This makes every row in these tables readable and writable
-- by anyone with the anon key (which ships in the frontend bundle).
-- Prefer adding proper RLS policies for production use.

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE %I.%I DISABLE ROW LEVEL SECURITY', r.schemaname, r.tablename);
    RAISE NOTICE 'Disabled RLS on %.%', r.schemaname, r.tablename;
  END LOOP;
END $$;

-- Verify: list all public tables and their RLS status
SELECT schemaname, tablename, rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
