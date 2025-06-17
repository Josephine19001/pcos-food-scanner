const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to calculate safety score based on ingredients
function calculateSafetyScore(ingredients) {
  if (!ingredients || ingredients.length === 0) return 7; // Default score

  const safeIngredients = ['aqua', 'water', 'shea butter', 'argan oil', 'vitamin e', 'panthenol'];
  const cautiousIngredients = ['sulfonate', 'fragrance', 'parfum'];

  let score = 8; // Start with good score

  ingredients.forEach((ingredient) => {
    const name = ingredient.name.toLowerCase();
    if (cautiousIngredients.some((caution) => name.includes(caution))) {
      score -= 1;
    }
    if (safeIngredients.some((safe) => name.includes(safe))) {
      score += 0.5;
    }
  });

  return Math.max(1, Math.min(10, Math.round(score)));
}

// Function to extract key ingredients
function extractKeyIngredients(ingredients) {
  if (!ingredients) return [];

  return ingredients.slice(0, 5).map((ingredient) => ({
    name: ingredient.name,
    type:
      ingredient.purpose === 'Moisturizer' || ingredient.purpose === 'Antioxidant'
        ? 'beneficial'
        : 'neutral',
    effect: ingredient.effect || 'General care',
  }));
}

// Function to generate random scan date within last 30 days
function generateRandomScanDate() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const randomTime =
    thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
  return new Date(randomTime).toISOString();
}

async function populateDatabase() {
  try {
    // Read the products JSON file
    const productsPath = path.join(__dirname, '../mock/products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

    console.log(`Found ${productsData.length} products to insert`);

    // Transform data for scanned_products table
    const scannedProducts = productsData.map((product, index) => {
      const safetyScore = calculateSafetyScore(product.ingredients);
      const keyIngredients = extractKeyIngredients(product.ingredients);

      return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category || product.type,
        safety_score: safetyScore,
        image_url:
          product.imageUrl ||
          `https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop&crop=center`,
        ingredients: product.ingredients || [],
        key_ingredients: keyIngredients,
        scanned_at: generateRandomScanDate(),
        user_id: '00000000-0000-0000-0000-000000000000', // You'll need to replace this with actual user IDs
      };
    });

    // Insert data in batches to avoid overwhelming the database
    const batchSize = 10;
    const batches = [];
    for (let i = 0; i < scannedProducts.length; i += batchSize) {
      batches.push(scannedProducts.slice(i, i + batchSize));
    }

    console.log(`Inserting ${scannedProducts.length} products in ${batches.length} batches...`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Inserting batch ${i + 1}/${batches.length} (${batch.length} products)...`);

      const { data, error } = await supabase.from('scanned_products').insert(batch);

      if (error) {
        console.error(`Error inserting batch ${i + 1}:`, error);
        // Continue with next batch instead of stopping
      } else {
        console.log(`Successfully inserted batch ${i + 1}`);
      }
    }

    console.log('Database population completed!');
  } catch (error) {
    console.error('Error populating database:', error);
  }
}

// Run the script
populateDatabase();
