-- Fix shipping_locations table for admin dashboard
-- The admin dashboard uses password protection, not Supabase authentication,
-- so all requests go as the `anon` role. The original migration only granted
-- SELECT to `anon` (and ALL to `authenticated`), which silently blocked
-- edit/delete from the admin Shipping Manager. Reads worked, writes did not.

-- 1. Ensure table exists (no-op if it was already created by the migration)
CREATE TABLE IF NOT EXISTS public.shipping_locations (
  id text PRIMARY KEY,
  name text NOT NULL,
  fee numeric(10,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Enable RLS (safe to call repeatedly)
ALTER TABLE public.shipping_locations ENABLE ROW LEVEL SECURITY;

-- 3. Drop old per-operation policies
DROP POLICY IF EXISTS "Allow public read access" ON public.shipping_locations;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.shipping_locations;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.shipping_locations;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.shipping_locations;

-- 4. Create one permissive policy matching the pattern used for couriers,
--    payment_methods and site_settings (admin is protected by a password on
--    the frontend, not by database auth)
CREATE POLICY "Allow public full access to shipping_locations"
  ON public.shipping_locations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Grant the privileges the anon role actually needs (the real blocker:
--    the migration only granted SELECT to anon)
GRANT ALL ON public.shipping_locations TO anon;
GRANT ALL ON public.shipping_locations TO authenticated;

-- 6. Verify
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'shipping_locations'
    AND policyname = 'Allow public full access to shipping_locations'
  ) THEN
    RAISE NOTICE 'Shipping locations permissions updated successfully';
  ELSE
    RAISE EXCEPTION 'Failed to update shipping_locations permissions';
  END IF;
END $$;
