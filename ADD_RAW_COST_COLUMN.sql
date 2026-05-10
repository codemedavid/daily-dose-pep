-- Adds raw_cost (cost-of-goods) to products and product_variations.
-- Used by the Analytics dashboard to compute net sales (cost basis) and profit.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS raw_cost numeric(12, 2) NOT NULL DEFAULT 0;

ALTER TABLE product_variations
  ADD COLUMN IF NOT EXISTS raw_cost numeric(12, 2) NOT NULL DEFAULT 0;

COMMENT ON COLUMN products.raw_cost IS 'Cost of goods per unit (used for profit calculations).';
COMMENT ON COLUMN product_variations.raw_cost IS 'Cost of goods per unit for this variation (overrides product.raw_cost).';
