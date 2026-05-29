-- Fix: couriers table is missing the sort_order column
-- Symptom: PGRST204 "Could not find the 'sort_order' column of 'couriers'"
-- Run this in the Supabase SQL editor.

ALTER TABLE couriers
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Give existing rows a sensible order (optional)
UPDATE couriers SET sort_order = 1 WHERE code = 'lbc'      AND sort_order = 0;
UPDATE couriers SET sort_order = 2 WHERE code = 'lalamove' AND sort_order = 0;
UPDATE couriers SET sort_order = 3 WHERE code = 'maxim'    AND sort_order = 0;
UPDATE couriers SET sort_order = 4 WHERE code = 'jnt'      AND sort_order = 0;

-- Refresh PostgREST schema cache so the API sees the new column immediately
NOTIFY pgrst, 'reload schema';
