-- ============================================================
-- Migrate product variations into standalone products
-- ============================================================
-- For every product that has variations, this script will:
--   1. Insert one new product per variation (copying parent's
--      description / category / purity / image / etc., and using
--      the variation's price + stock_quantity)
--   2. Delete the parent product (cascades to product_variations)
--
-- Products that have NO variations are left untouched.
--
-- Run inside a transaction so it can be rolled back if anything
-- looks wrong before COMMIT.
-- ============================================================

BEGIN;

-- 1) Create the new "flat" products from each variation row.
INSERT INTO products (
  name,
  description,
  category,
  base_price,
  discount_price,
  discount_active,
  purity_percentage,
  molecular_weight,
  cas_number,
  sequence,
  storage_conditions,
  inclusions,
  stock_quantity,
  available,
  featured,
  image_url,
  safety_sheet_url
)
SELECT
  -- Use variation name as-is if it already includes the parent name;
  -- otherwise prefix with parent name.  E.g. "Tirzepatide 15mg Vial".
  CASE
    WHEN v.name ILIKE p.name || '%' THEN v.name
    ELSE p.name || ' ' || v.name
  END                                    AS name,
  p.description,
  p.category,
  v.price                                AS base_price,
  v.discount_price,
  COALESCE(v.discount_active, false)     AS discount_active,
  p.purity_percentage,
  p.molecular_weight,
  p.cas_number,
  p.sequence,
  p.storage_conditions,
  p.inclusions,
  COALESCE(v.stock_quantity, 0)          AS stock_quantity,
  p.available,
  p.featured,
  p.image_url,
  p.safety_sheet_url
FROM products p
JOIN product_variations v ON v.product_id = p.id
ORDER BY p.name, v.quantity_mg;

-- 2) Delete the original parent products that had variations.
--    This cascades and removes their product_variations rows.
DELETE FROM products
WHERE id IN (
  SELECT DISTINCT product_id FROM product_variations
);

-- 3) Sanity check — there should be zero variations left.
DO $$
DECLARE
  remaining INT;
BEGIN
  SELECT COUNT(*) INTO remaining FROM product_variations;
  IF remaining <> 0 THEN
    RAISE EXCEPTION 'Migration failed: % variations still exist', remaining;
  END IF;
END $$;

-- 4) Show the final product list for review before commit.
SELECT name, category, base_price, stock_quantity, available
FROM products
ORDER BY category, name;

-- ============================================================
-- If the SELECT above looks correct, run:
--    COMMIT;
-- If anything looks wrong, run:
--    ROLLBACK;
-- ============================================================
