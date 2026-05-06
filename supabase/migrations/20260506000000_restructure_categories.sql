-- =============================================================================
-- Restructure product catalog into 3 wellness-focused categories
-- Categories: Metabolic Support / Skin, Hair & Longevity / Immune System & Cellular Repair
-- =============================================================================

DELETE FROM product_variations;
DELETE FROM products;
DELETE FROM categories;

-- =============================================================================
-- CATEGORIES
-- =============================================================================
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  (gen_random_uuid(), 'Metabolic Support',              'Flame',   1, true),
  (gen_random_uuid(), 'Skin, Hair & Longevity',         'Diamond', 2, true),
  (gen_random_uuid(), 'Immune System & Cellular Repair','Dna',     3, true);

-- =============================================================================
-- PRODUCTS + VARIATIONS
-- =============================================================================
DO $$
DECLARE
  metabolic_cat TEXT;
  skin_cat      TEXT;
  immune_cat    TEXT;

  tirz_id     UUID;
  retat_id    UUID;
  cagri_id    UUID;
  aod_id      UUID;
  tesam_id    UUID;
  fatblast_id UUID;
  lipob12_id  UUID;

  ghkcu_id      UUID;
  ghkcu_top_id  UUID;
  snap8_id      UUID;
  gluta_id      UUID;
  ahkcu_top_id  UUID;

  ss31_id     UUID;
  epit_id     UUID;
  nad_id      UUID;
  kpv_id      UUID;
BEGIN
  SELECT id::TEXT INTO metabolic_cat FROM categories WHERE name = 'Metabolic Support';
  SELECT id::TEXT INTO skin_cat      FROM categories WHERE name = 'Skin, Hair & Longevity';
  SELECT id::TEXT INTO immune_cat    FROM categories WHERE name = 'Immune System & Cellular Repair';

  -- -------------------------------------------------------------------------
  -- METABOLIC SUPPORT
  -- -------------------------------------------------------------------------

  -- Tirzepatide (15mg / 30mg)
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'Tirzepatide',
    'Dual GIP/GLP-1 receptor agonist for effective weight management. Each complete set includes mixing supplies and usage guide.',
    metabolic_cat, 2500.00, 99.0, true, true, 50,
    ARRAY['6 Insulin Syringes', '1 Recon Syringe', '12 Alcohol Pads', 'Guide']
  ) RETURNING id INTO tirz_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (tirz_id, 'Tirzepatide 15mg', 15, 2500.00, 50),
    (tirz_id, 'Tirzepatide 30mg', 30, 3500.00, 50);

  -- Retatrutide 10mg
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'Retatrutide',
    'Triple GIP/GLP-1/glucagon receptor agonist for advanced weight and metabolic management.',
    metabolic_cat, 3000.00, 99.0, true, true, 50,
    ARRAY['6 Insulin Syringes', '1 Recon Syringe', '12 Alcohol Pads', 'Guide']
  ) RETURNING id INTO retat_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (retat_id, 'Retatrutide 10mg', 10, 3000.00, 50);

  -- Cagrilintide 5mg
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'Cagrilintide',
    'Next-generation amylin analogue for appetite regulation and metabolic support.',
    metabolic_cat, 2200.00, 99.0, false, true, 30,
    ARRAY['10 Insulin Syringes', '1 Recon Syringe', '20 Alcohol Pads', 'Guide']
  ) RETURNING id INTO cagri_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (cagri_id, 'Cagrilintide 5mg', 5, 2200.00, 30);

  -- AOD-9604 5mg
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'AOD-9604',
    'Anti-obesity peptide fragment derived from human growth hormone for targeted fat metabolism.',
    metabolic_cat, 2200.00, 99.0, false, true, 35,
    ARRAY['10 Insulin Syringes', '1 Recon Syringe', '20 Alcohol Pads', 'Guide']
  ) RETURNING id INTO aod_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (aod_id, 'AOD-9604 5mg', 5, 2200.00, 35);

  -- Tesamorelin 10mg
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'Tesamorelin',
    'Growth hormone-releasing factor analogue for body composition, visceral fat reduction, and metabolic support.',
    metabolic_cat, 2800.00, 99.0, false, true, 30,
    ARRAY['10 Insulin Syringes', '1 Recon Syringe', '20 Alcohol Pads', 'Guide']
  ) RETURNING id INTO tesam_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (tesam_id, 'Tesamorelin 10mg', 10, 2800.00, 30);

  -- Fat Blaster 10 mL
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'Fat Blaster',
    'Advanced lipotropic fat-burning blend for enhanced body composition and metabolic support.',
    metabolic_cat, 2200.00, 99.0, false, true, 40,
    ARRAY['10 Insulin Syringes', '1 Recon Syringe', '20 Alcohol Pads', 'Guide']
  ) RETURNING id INTO fatblast_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (fatblast_id, 'Fat Blaster 10mL', 10, 2200.00, 40);

  -- Lipo-C + B12 10 mL
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'Lipo-C + B12',
    'Lipotropic Vitamin C and B12 blend supporting fat metabolism, energy, and overall vitality.',
    metabolic_cat, 1800.00, 99.0, false, true, 40,
    ARRAY['10 Insulin Syringes', '1 Recon Syringe', '20 Alcohol Pads', 'Guide']
  ) RETURNING id INTO lipob12_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (lipob12_id, 'Lipo-C + B12 10mL', 10, 1800.00, 40);

  -- -------------------------------------------------------------------------
  -- SKIN, HAIR & LONGEVITY
  -- -------------------------------------------------------------------------

  -- GHK-Cu (50mg / 100mg)
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'GHK-Cu',
    'Copper peptide complex for skin rejuvenation, collagen synthesis, wound healing, and anti-aging benefits.',
    skin_cat, 1800.00, 99.0, true, true, 40,
    ARRAY['25 Insulin Syringes', '1 Recon Syringe', '50 Alcohol Pads', 'Guide']
  ) RETURNING id INTO ghkcu_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (ghkcu_id, 'GHK-Cu 50mg',  50,  1800.00, 40),
    (ghkcu_id, 'GHK-Cu 100mg', 100, 2200.00, 40);

  -- GHK-Cu Topical (NEW - placeholder price, please confirm)
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'GHK-Cu Topical',
    'Topical copper peptide formulation for direct skin application — supports collagen, elasticity, and visible skin renewal.',
    skin_cat, 1500.00, 99.0, false, true, 30,
    ARRAY['Topical applicator', 'Usage Guide']
  ) RETURNING id INTO ghkcu_top_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (ghkcu_top_id, 'GHK-Cu Topical', 0, 1500.00, 30);

  -- SNAP-8 (NEW - placeholder price, please confirm)
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'SNAP-8',
    'Anti-wrinkle peptide that helps reduce expression lines and visibly smooth skin.',
    skin_cat, 1800.00, 99.0, false, true, 30,
    ARRAY['Topical applicator', 'Usage Guide']
  ) RETURNING id INTO snap8_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (snap8_id, 'SNAP-8', 0, 1800.00, 30);

  -- Glutathione 1500mg
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'Glutathione',
    'Master antioxidant peptide supporting skin brightening, detoxification, and immune function.',
    skin_cat, 2100.00, 99.0, false, true, 40,
    ARRAY['10 Insulin Syringes', '1 Recon Syringe', '20 Alcohol Pads', 'Guide']
  ) RETURNING id INTO gluta_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (gluta_id, 'Glutathione 1500mg', 1500, 2100.00, 40);

  -- AHK-Cu Topical (NEW - placeholder price, please confirm)
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'AHK-Cu Topical',
    'Topical copper peptide for hair follicle support, scalp health, and visible hair revitalization.',
    skin_cat, 1500.00, 99.0, false, true, 30,
    ARRAY['Topical applicator', 'Usage Guide']
  ) RETURNING id INTO ahkcu_top_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (ahkcu_top_id, 'AHK-Cu Topical', 0, 1500.00, 30);

  -- -------------------------------------------------------------------------
  -- IMMUNE SYSTEM & CELLULAR REPAIR
  -- -------------------------------------------------------------------------

  -- SS-31 10mg
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'SS-31',
    'Mitochondria-targeting antioxidant peptide for cellular protection, energy, and anti-aging support.',
    immune_cat, 2100.00, 99.0, false, true, 35,
    ARRAY['10 Insulin Syringes', '1 Recon Syringe', '20 Alcohol Pads', 'Guide']
  ) RETURNING id INTO ss31_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (ss31_id, 'SS-31 10mg', 10, 2100.00, 35);

  -- Epithalon 50mg
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'Epithalon',
    'Telomerase-activating tetrapeptide for anti-aging, longevity, and circadian rhythm regulation.',
    immune_cat, 2400.00, 99.0, false, true, 30,
    ARRAY['10 Insulin Syringes', '1 Recon Syringe', '20 Alcohol Pads', 'Guide']
  ) RETURNING id INTO epit_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (epit_id, 'Epithalon 50mg', 50, 2400.00, 30);

  -- NAD+ (100mg / 500mg) — 100mg is NEW, placeholder price
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'NAD+',
    'Nicotinamide adenine dinucleotide for cellular energy production, DNA repair, and longevity support.',
    immune_cat, 1500.00, 99.0, true, true, 30,
    ARRAY['10 Insulin Syringes', '1 Recon Syringe', '20 Alcohol Pads', 'Guide']
  ) RETURNING id INTO nad_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (nad_id, 'NAD+ 100mg', 100, 1500.00, 30),
    (nad_id, 'NAD+ 500mg', 500, 2500.00, 30);

  -- KPV 10mg
  INSERT INTO products (name, description, category, base_price, purity_percentage, featured, available, stock_quantity, inclusions)
  VALUES (
    'KPV',
    'Anti-inflammatory tripeptide supporting skin health, gut healing, and immune modulation.',
    immune_cat, 2000.00, 99.0, false, true, 35,
    ARRAY['10 Insulin Syringes', '1 Recon Syringe', '20 Alcohol Pads', 'Guide']
  ) RETURNING id INTO kpv_id;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
    (kpv_id, 'KPV 10mg', 10, 2000.00, 35);

END $$;

-- =============================================================================
-- VERIFY
-- =============================================================================
SELECT
  c.name AS category,
  p.name,
  p.base_price,
  p.available
FROM products p
JOIN categories c ON c.id::TEXT = p.category
ORDER BY c.sort_order, p.base_price;
