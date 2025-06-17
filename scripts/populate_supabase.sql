-- Populate scanned_products table with mock data
-- Make sure to replace 'your-project-url' with your actual Supabase project URL

-- First, let's insert some sample products with real image URLs from your storage
INSERT INTO public.scanned_products (
  id, 
  name, 
  brand, 
  category, 
  safety_score, 
  image_url, 
  ingredients, 
  key_ingredients, 
  scanned_at,
  user_id,
  is_favorite
) VALUES 
-- Recent scans (last few days) - some favorites
(
  'prod_001',
  'Shea Butter Sulfate-Free Cleansing Cream Shampoo',
  'Cantu',
  'shampoo',
  8,
  'https://your-project-url.supabase.co/storage/v1/object/public/product-images/scan-1750041698403.jpeg',
  '[
    {"name": "Aqua (Water)", "purpose": "Solvent", "effect": "Hydrates and dissolves other ingredients"},
    {"name": "Sodium C14-16 Olefin Sulfonate", "purpose": "Surfactant", "effect": "Cleanses by helping water to mix with oil and dirt"},
    {"name": "Cocamidopropyl Betaine", "purpose": "Surfactant", "effect": "Mild cleanser derived from coconut oil"},
    {"name": "Panthenol", "purpose": "Pro-vitamin B5", "effect": "Improves hair elasticity, moisture retention, and flexibility"},
    {"name": "Tocopheryl Acetate (Vitamin E)", "purpose": "Antioxidant", "effect": "Protects hair and skin cells from damage"}
  ]'::jsonb,
  '[
    {"name": "Aqua (Water)", "type": "neutral", "effect": "Hydrates and dissolves other ingredients"},
    {"name": "Panthenol", "type": "beneficial", "effect": "Improves hair elasticity"},
    {"name": "Tocopheryl Acetate", "type": "beneficial", "effect": "Antioxidant protection"},
    {"name": "Cocamidopropyl Betaine", "type": "neutral", "effect": "Mild cleanser"},
    {"name": "Sodium C14-16 Olefin Sulfonate", "type": "neutral", "effect": "Primary cleanser"}
  ]'::jsonb,
  NOW() - INTERVAL '1 day',
  '00000000-0000-0000-0000-000000000000',
  true
),
(
  'prod_002',
  'Hydrating Deep Conditioner',
  'Moisture Pro',
  'conditioner',
  9,
  'https://your-project-url.supabase.co/storage/v1/object/public/product-images/scan-1750041889442.jpeg',
  '[
    {"name": "Aqua (Water)", "purpose": "Solvent", "effect": "Hydrates"},
    {"name": "Cetearyl Alcohol", "purpose": "Emollient", "effect": "Softens hair"},
    {"name": "Shea Butter", "purpose": "Moisturizer", "effect": "Adds intense moisture"},
    {"name": "Argan Oil", "purpose": "Nourishment", "effect": "Improves shine and softness"},
    {"name": "Fragrance", "purpose": "Scent", "effect": "Adds pleasant smell"}
  ]'::jsonb,
  '[
    {"name": "Shea Butter", "type": "beneficial", "effect": "Intense moisture"},
    {"name": "Argan Oil", "type": "beneficial", "effect": "Shine and softness"},
    {"name": "Cetearyl Alcohol", "type": "beneficial", "effect": "Emollient properties"},
    {"name": "Aqua (Water)", "type": "neutral", "effect": "Base solvent"},
    {"name": "Fragrance", "type": "neutral", "effect": "Scent"}
  ]'::jsonb,
  NOW() - INTERVAL '2 days',
  '00000000-0000-0000-0000-000000000000',
  false
),
(
  'prod_003',
  'Nourishing Hair Oil',
  'Natural Essence',
  'oil',
  7,
  'https://your-project-url.supabase.co/storage/v1/object/public/product-images/scan-1750042252368.jpeg',
  '[
    {"name": "Coconut Oil", "purpose": "Moisturizer", "effect": "Deep conditioning"},
    {"name": "Jojoba Oil", "purpose": "Emollient", "effect": "Balances scalp"},
    {"name": "Vitamin E", "purpose": "Antioxidant", "effect": "Protects from damage"},
    {"name": "Rosemary Extract", "purpose": "Stimulant", "effect": "Promotes growth"},
    {"name": "Fragrance", "purpose": "Scent", "effect": "Pleasant aroma"}
  ]'::jsonb,
  '[
    {"name": "Coconut Oil", "type": "beneficial", "effect": "Deep conditioning"},
    {"name": "Jojoba Oil", "type": "beneficial", "effect": "Scalp balance"},
    {"name": "Vitamin E", "type": "beneficial", "effect": "Antioxidant protection"},
    {"name": "Rosemary Extract", "type": "beneficial", "effect": "Growth stimulation"},
    {"name": "Fragrance", "type": "neutral", "effect": "Scent"}
  ]'::jsonb,
  NOW() - INTERVAL '3 days',
  '00000000-0000-0000-0000-000000000000',
  true
),
(
  'prod_004',
  'Curl Defining Cream',
  'CurlCare',
  'styling',
  6,
  'https://your-project-url.supabase.co/storage/v1/object/public/product-images/scan-1750042513807.jpeg',
  '[
    {"name": "Aqua (Water)", "purpose": "Solvent", "effect": "Base ingredient"},
    {"name": "Glycerin", "purpose": "Humectant", "effect": "Retains moisture"},
    {"name": "Carbomer", "purpose": "Thickener", "effect": "Gel consistency"},
    {"name": "Polyquaternium-10", "purpose": "Conditioning agent", "effect": "Smooths hair"},
    {"name": "Phenoxyethanol", "purpose": "Preservative", "effect": "Product stability"}
  ]'::jsonb,
  '[
    {"name": "Glycerin", "type": "beneficial", "effect": "Moisture retention"},
    {"name": "Polyquaternium-10", "type": "beneficial", "effect": "Hair conditioning"},
    {"name": "Aqua (Water)", "type": "neutral", "effect": "Base solvent"},
    {"name": "Carbomer", "type": "neutral", "effect": "Texture"},
    {"name": "Phenoxyethanol", "type": "caution", "effect": "Preservative"}
  ]'::jsonb,
  NOW() - INTERVAL '1 hour',
  '00000000-0000-0000-0000-000000000000',
  false
),

-- Older scans (favorites and regular)
(
  'prod_005',
  'Protein Treatment Mask',
  'Repair Plus',
  'treatment',
  8,
  'https://your-project-url.supabase.co/storage/v1/object/public/product-images/scan-1750042591123.jpeg',
  '[
    {"name": "Hydrolyzed Keratin", "purpose": "Protein", "effect": "Strengthens hair structure"},
    {"name": "Aqua (Water)", "purpose": "Solvent", "effect": "Base ingredient"},
    {"name": "Cetyl Alcohol", "purpose": "Emollient", "effect": "Softening agent"},
    {"name": "Panthenol", "purpose": "Pro-vitamin B5", "effect": "Moisture and flexibility"},
    {"name": "Citric Acid", "purpose": "pH Adjuster", "effect": "Balances acidity"}
  ]'::jsonb,
  '[
    {"name": "Hydrolyzed Keratin", "type": "beneficial", "effect": "Structural strengthening"},
    {"name": "Panthenol", "type": "beneficial", "effect": "Moisture and flexibility"},
    {"name": "Cetyl Alcohol", "type": "beneficial", "effect": "Softening"},
    {"name": "Aqua (Water)", "type": "neutral", "effect": "Base"},
    {"name": "Citric Acid", "type": "neutral", "effect": "pH balance"}
  ]'::jsonb,
  NOW() - INTERVAL '1 week',
  '00000000-0000-0000-0000-000000000000',
  true
),
(
  'prod_006',
  'Volumizing Mousse',
  'Volume Max',
  'styling',
  5,
  'https://your-project-url.supabase.co/storage/v1/object/public/product-images/scan-1750042838688.jpeg',
  '[
    {"name": "Aqua (Water)", "purpose": "Solvent", "effect": "Base ingredient"},
    {"name": "Alcohol Denat", "purpose": "Solvent", "effect": "Quick drying"},
    {"name": "VP/VA Copolymer", "purpose": "Film former", "effect": "Hold and volume"},
    {"name": "Panthenol", "purpose": "Conditioning agent", "effect": "Hair health"},
    {"name": "Fragrance", "purpose": "Scent", "effect": "Pleasant smell"}
  ]'::jsonb,
  '[
    {"name": "Panthenol", "type": "beneficial", "effect": "Conditioning"},
    {"name": "VP/VA Copolymer", "type": "neutral", "effect": "Volume and hold"},
    {"name": "Aqua (Water)", "type": "neutral", "effect": "Base"},
    {"name": "Alcohol Denat", "type": "caution", "effect": "Can be drying"},
    {"name": "Fragrance", "type": "caution", "effect": "Potential irritant"}
  ]'::jsonb,
  NOW() - INTERVAL '10 days',
  '00000000-0000-0000-0000-000000000000',
  false
),
(
  'prod_007',
  'Sulfate-Free Daily Shampoo',
  'Gentle Clean',
  'shampoo',
  9,
  'https://your-project-url.supabase.co/storage/v1/object/public/product-images/scan-1750042889207.jpeg',
  '[
    {"name": "Aqua (Water)", "purpose": "Solvent", "effect": "Base ingredient"},
    {"name": "Coco-Glucoside", "purpose": "Surfactant", "effect": "Gentle cleansing"},
    {"name": "Sodium Cocoyl Isethionate", "purpose": "Surfactant", "effect": "Mild cleanser"},
    {"name": "Glycerin", "purpose": "Humectant", "effect": "Moisture retention"},
    {"name": "Aloe Vera Extract", "purpose": "Soothing agent", "effect": "Scalp comfort"}
  ]'::jsonb,
  '[
    {"name": "Aloe Vera Extract", "type": "beneficial", "effect": "Soothing and healing"},
    {"name": "Glycerin", "type": "beneficial", "effect": "Moisture retention"},
    {"name": "Coco-Glucoside", "type": "beneficial", "effect": "Gentle cleansing"},
    {"name": "Sodium Cocoyl Isethionate", "type": "beneficial", "effect": "Mild surfactant"},
    {"name": "Aqua (Water)", "type": "neutral", "effect": "Base"}
  ]'::jsonb,
  NOW() - INTERVAL '2 weeks',
  '00000000-0000-0000-0000-000000000000',
  true
),
(
  'prod_008',
  'Heat Protection Spray',
  'Style Shield',
  'styling',
  7,
  'https://your-project-url.supabase.co/storage/v1/object/public/product-images/scan-1750043144780.jpeg',
  '[
    {"name": "Aqua (Water)", "purpose": "Solvent", "effect": "Base ingredient"},
    {"name": "Cyclopentasiloxane", "purpose": "Silicone", "effect": "Heat protection"},
    {"name": "Dimethicone", "purpose": "Silicone", "effect": "Smoothing and shine"},
    {"name": "Panthenol", "purpose": "Conditioning agent", "effect": "Hair health"},
    {"name": "Phenoxyethanol", "purpose": "Preservative", "effect": "Product stability"}
  ]'::jsonb,
  '[
    {"name": "Cyclopentasiloxane", "type": "beneficial", "effect": "Heat protection"},
    {"name": "Dimethicone", "type": "beneficial", "effect": "Smoothing"},
    {"name": "Panthenol", "type": "beneficial", "effect": "Conditioning"},
    {"name": "Aqua (Water)", "type": "neutral", "effect": "Base"},
    {"name": "Phenoxyethanol", "type": "neutral", "effect": "Preservation"}
  ]'::jsonb,
  NOW() - INTERVAL '3 weeks',
  '00000000-0000-0000-0000-000000000000',
  false
);

-- Note: Replace 'your-project-url' with your actual Supabase project URL
-- Example: https://abcdefghijklmnop.supabase.co

-- To find your project URL:
-- 1. Go to your Supabase dashboard
-- 2. Go to Settings > API
-- 3. Copy the Project URL 