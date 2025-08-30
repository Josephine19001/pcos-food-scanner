import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Groq from 'npm:groq-sdk';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const groq = new Groq({
  apiKey: Deno.env.get('GROQ_API_KEY') ?? '',
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status);
}

// Get beauty recommendations for current cycle phase
async function getCycleBeautyRecommendations(cyclePhase: string) {
  const { data: recommendations, error } = await supabase
    .from('beauty_recommendations')
    .select('*')
    .eq('cycle_phase', cyclePhase)
    .order('priority', { ascending: true });

  if (error) {
    throw new Error(`Failed to get recommendations: ${error.message}`);
  }

  return recommendations || [];
}

// Enhanced AI analysis with cycle insights
async function analyzeProductWithCycleInsights(productData: any) {
  const prompt = `Analyze this beauty product for women's menstrual cycle phases. Return ONLY valid JSON.

Product: ${productData.name}
Brand: ${productData.brand}
Category: ${productData.category}
Ingredients: ${JSON.stringify(productData.ingredients)}

Return this exact structure:
{
  "cycle_insights": {
    "menstrual_phase": {
      "recommended": boolean,
      "reason": string (explain why good/bad during sensitive period days)
    },
    "follicular_phase": {
      "recommended": boolean,
      "reason": string (explain why good/bad during energy-building days)
    },
    "ovulatory_phase": {
      "recommended": boolean,
      "reason": string (explain why good/bad during peak hormone/oil production days)
    },
    "luteal_phase": {
      "recommended": boolean,
      "reason": string (explain why good/bad during PMS/reactive skin days)
    }
  },
  "hormone_impact": {
    "may_worsen_pms": boolean,
    "may_cause_breakouts": boolean,
    "good_for_sensitive_skin": boolean,
    "description": string (how ingredients affect hormonal symptoms)
  },
  "best_cycle_phase": string (which phase this product is most suitable for),
  "cycle_specific_benefits": string[] (list of cycle-specific benefits)
}

IMPORTANT GUIDELINES:
- Menstrual phase: Skin is sensitive, avoid harsh actives, prefer gentle/hydrating
- Follicular phase: Skin resilience building, good time for vitamin C, light actives  
- Ovulatory phase: Peak sebum production, need oil control, can handle stronger actives
- Luteal phase: Skin becomes reactive, avoid new products, prefer anti-inflammatory
- Flag ingredients that worsen PMS: high sodium, caffeine, artificial fragrances
- Consider hormonal acne triggers: comedogenic oils, pore-clogging ingredients
- Sensitive skin friendly: fragrance-free, hypoallergenic, gentle formulations`;

  try {
    const chat = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: 'Analyze this product for cycle compatibility.' },
      ],
    });

    const message = chat.choices[0]?.message?.content ?? '';
    const match = message.match(/\{[\s\S]*\}/);

    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('No valid JSON found in response');
  } catch (error) {
    console.error('AI analysis error:', error);
    // Return safe defaults if AI fails
    return {
      cycle_insights: {
        menstrual_phase: {
          recommended: true,
          reason: 'Generally suitable for sensitive period skin',
        },
        follicular_phase: { recommended: true, reason: 'Good for building energy phase' },
        ovulatory_phase: { recommended: true, reason: 'Suitable for peak hormone phase' },
        luteal_phase: { recommended: true, reason: 'Appropriate for pre-period phase' },
      },
      hormone_impact: {
        may_worsen_pms: false,
        may_cause_breakouts: false,
        good_for_sensitive_skin: true,
        description: 'No specific hormone impact detected',
      },
      best_cycle_phase: 'all',
      cycle_specific_benefits: ['General skincare benefits'],
    };
  }
}

// Get personalized recommendations based on user's cycle and skin concerns
async function getPersonalizedRecommendations(userId: string, cyclePhase: string) {
  // Get user's recent period logs to understand their patterns
  const { data: periodLogs } = await supabase
    .from('period_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(30);

  // Get user's scanned products to understand preferences
  const { data: scannedProducts } = await supabase
    .from('scanned_products')
    .select('*')
    .eq('user_id', userId)
    .order('scanned_at', { ascending: false })
    .limit(20);

  // Analyze patterns
  const commonSymptoms = (periodLogs || [])
    .flatMap((log) => log.symptoms || [])
    .reduce((acc: any, symptom: string) => {
      acc[symptom] = (acc[symptom] || 0) + 1;
      return acc;
    }, {});

  const preferredCategories = (scannedProducts || [])
    .map((product) => product.category)
    .reduce((acc: any, category: string) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

  // Get base recommendations for cycle phase
  const baseRecommendations = await getCycleBeautyRecommendations(cyclePhase);

  // Customize based on user patterns
  const personalizedRecommendations = baseRecommendations.map((rec) => {
    let priority = rec.priority;
    let customReason = rec.recommendation_text;

    // Boost priority for categories user frequently scans
    if (preferredCategories[rec.product_category] >= 3) {
      priority = Math.max(1, priority - 1);
      customReason += ` (Based on your product preferences)`;
    }

    // Customize for common symptoms
    if (commonSymptoms['Acne'] && rec.recommended_ingredients.includes('niacinamide')) {
      priority = 1;
      customReason += ` Especially good for acne-prone skin during this phase.`;
    }

    if (commonSymptoms['Bloating'] && rec.recommended_ingredients.includes('caffeine')) {
      customReason += ` May help with puffiness you've experienced.`;
    }

    return {
      ...rec,
      priority,
      recommendation_text: customReason,
      personalized: true,
    };
  });

  return personalizedRecommendations.sort((a, b) => a.priority - b.priority);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    switch (req.method) {
      case 'GET':
        if (path === 'recommendations') {
          const cyclePhase = url.searchParams.get('cycle_phase');
          const userId = url.searchParams.get('user_id');

          if (!cyclePhase) {
            return errorResponse('cycle_phase parameter required');
          }

          let recommendations;
          if (userId) {
            recommendations = await getPersonalizedRecommendations(userId, cyclePhase);
          } else {
            recommendations = await getCycleBeautyRecommendations(cyclePhase);
          }

          return jsonResponse(recommendations);
        }

        if (path === 'ingredients') {
          // Get cycle-specific ingredient recommendations
          const cyclePhase = url.searchParams.get('cycle_phase');

          if (!cyclePhase) {
            return errorResponse('cycle_phase parameter required');
          }

          const recommendations = await getCycleBeautyRecommendations(cyclePhase);

          const ingredients = {
            recommended: [...new Set(recommendations.flatMap((r) => r.recommended_ingredients))],
            avoid: [...new Set(recommendations.flatMap((r) => r.ingredients_to_avoid))],
          };

          return jsonResponse(ingredients);
        }

        break;

      case 'POST':
        if (path === 'analyze-product') {
          // Analyze a product for cycle compatibility
          const productData = await req.json();

          const analysis = await analyzeProductWithCycleInsights(productData);
          return jsonResponse(analysis);
        }

        if (path === 'save-scan-with-insights') {
          // Save a scanned product with cycle insights
          const {
            data: { user },
          } = await supabase.auth.getUser(
            req.headers.get('Authorization')?.replace('Bearer ', '') || ''
          );

          if (!user) {
            return errorResponse('Unauthorized', 401);
          }

          const scanData = await req.json();

          // Get cycle insights from AI
          const cycleInsights = await analyzeProductWithCycleInsights(scanData);

          // Save to database
          const { data, error } = await supabase
            .from('scanned_products')
            .insert({
              id: scanData.id,
              user_id: user.id,
              name: scanData.name,
              brand: scanData.brand,
              category: scanData.category,
              safety_score: scanData.safety_score,
              image_url: scanData.image_url,
              ingredients: scanData.ingredients,
              key_ingredients: scanData.key_ingredients,
              cycle_insights: cycleInsights.cycle_insights,
              hormone_impact: cycleInsights.hormone_impact,
              product_links: scanData.product_links,
              scanned_at: new Date().toISOString(),
              is_favorite: false,
            })
            .select()
            .single();

          if (error) {
            return errorResponse(error.message);
          }

          return jsonResponse({
            ...data,
            best_cycle_phase: cycleInsights.best_cycle_phase,
            cycle_specific_benefits: cycleInsights.cycle_specific_benefits,
          });
        }

        break;

      default:
        return errorResponse('Method not allowed', 405);
    }

    return errorResponse('Invalid endpoint', 404);
  } catch (error) {
    console.error('Beauty cycle recommendations error:', error);
    return errorResponse('Internal server error', 500);
  }
});
