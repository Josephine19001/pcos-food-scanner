import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisResult {
  name: string;
  status: 'safe' | 'caution' | 'avoid';
  summary: string;
  ingredients: string[];
  analysis: {
    glycemic_index: 'low' | 'medium' | 'high';
    sugar_content: 'low' | 'moderate' | 'high';
    inflammatory_score: number;
    hormone_impact: 'positive' | 'neutral' | 'negative';
    fiber_content: 'low' | 'moderate' | 'high';
    protein_quality: 'low' | 'moderate' | 'high';
    healthy_fats: boolean;
    processed_level: 'minimally' | 'moderately' | 'highly';
    recommendations: string[];
    warnings: string[];
  };
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface OnboardingProfile {
  primary_goal: string | null;
  symptoms: string[];
  daily_struggles: string[];
  food_relationship: string | null;
  feel_good_foods: string[];
  guilt_foods: string[];
  activity_level: string | null;
}

// Map goal codes to readable descriptions
const goalDescriptions: Record<string, string> = {
  'manage-weight': 'managing their weight',
  'reduce-symptoms': 'reducing PCOS symptoms',
  'fertility': 'supporting fertility',
  'energy': 'improving energy levels',
  'understand': 'understanding what foods to eat',
  'peace': 'finding peace with food',
};

// Map symptom codes to readable descriptions
const symptomDescriptions: Record<string, string> = {
  'irregular-periods': 'irregular periods',
  'weight-gain': 'weight gain',
  'fatigue': 'fatigue',
  'acne': 'acne/skin issues',
  'hair-loss': 'hair thinning',
  'hair-growth': 'excess hair growth (hirsutism)',
  'mood-swings': 'mood changes',
  'cravings': 'sugar cravings',
  'bloating': 'bloating',
  'brain-fog': 'brain fog',
};

// Map activity levels to descriptions
const activityDescriptions: Record<string, string> = {
  'sedentary': 'mostly sedentary (sitting most of the day)',
  'light': 'lightly active',
  'moderate': 'moderately active',
  'active': 'quite active',
  'very-active': 'very active',
  'varies': 'activity varies day to day',
};

// Map language codes to full language names for the AI prompt
const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
};

function buildPersonalizedPrompt(profile: OnboardingProfile | null, language: string = 'en'): string {
  const languageName = languageNames[language] || 'English';
  const languageInstruction = language !== 'en'
    ? `\n\n**IMPORTANT LANGUAGE INSTRUCTION:**\nYou MUST respond entirely in ${languageName}. All text fields in your JSON response (name, summary, ingredients, recommendations, warnings) must be written in ${languageName}. Do NOT use English for any user-facing text.`
    : '';

  const basePrompt = `You are a specialized nutrition analyst for women with Polycystic Ovary Syndrome (PCOS). Your role is to analyze food images and provide detailed nutritional assessments specifically relevant to PCOS management.${languageInstruction}

When analyzing food, consider these PCOS-specific factors:
1. **Glycemic Index (GI)**: Low GI foods are preferred as they help manage insulin resistance
2. **Sugar Content**: High sugar worsens insulin resistance and hormonal imbalances
3. **Inflammatory Score (1-10)**: Lower is better. Inflammation exacerbates PCOS symptoms
4. **Hormone Impact**: How the food affects insulin, androgens, and estrogen balance
5. **Fiber Content**: High fiber helps with blood sugar control and gut health
6. **Protein Quality**: Adequate protein helps with satiety and blood sugar stability
7. **Healthy Fats**: Omega-3s and monounsaturated fats are beneficial
8. **Processing Level**: Minimally processed whole foods are preferred

Classification Guidelines:
- **SAFE**: Low GI, anti-inflammatory, hormone-balancing foods (leafy greens, fatty fish, berries, nuts, seeds, lean proteins, whole grains)
- **CAUTION**: Moderate GI, some inflammatory potential, consume in moderation (white rice, some fruits, dairy, whole wheat bread)
- **AVOID**: High GI, highly inflammatory, hormone-disrupting foods (sugary drinks, processed foods, refined carbs, excessive dairy, trans fats)`;

  // If no profile, return base prompt
  if (!profile) {
    return basePrompt + '\n\nProvide general PCOS-friendly recommendations.';
  }

  // Build personalized context
  const personalContext: string[] = [];

  // Add primary goal
  if (profile.primary_goal && goalDescriptions[profile.primary_goal]) {
    personalContext.push(`Their primary health goal is ${goalDescriptions[profile.primary_goal]}.`);
  }

  // Add symptoms
  if (profile.symptoms && profile.symptoms.length > 0) {
    const symptomList = profile.symptoms
      .map(s => symptomDescriptions[s] || s)
      .filter(Boolean);
    if (symptomList.length > 0) {
      personalContext.push(`They are experiencing these PCOS symptoms: ${symptomList.join(', ')}.`);
    }
  }

  // Add activity level
  if (profile.activity_level && activityDescriptions[profile.activity_level]) {
    personalContext.push(`Their activity level is ${activityDescriptions[profile.activity_level]}.`);
  }

  // Add food preferences (guilt foods they want to enjoy)
  if (profile.guilt_foods && profile.guilt_foods.length > 0) {
    personalContext.push(`Foods they enjoy but feel conflicted about: ${profile.guilt_foods.join(', ')}.`);
  }

  // Add feel good foods
  if (profile.feel_good_foods && profile.feel_good_foods.length > 0) {
    personalContext.push(`Foods that make them feel good: ${profile.feel_good_foods.join(', ')}.`);
  }

  // Build the personalization section
  let personalizedSection = '';
  if (personalContext.length > 0) {
    personalizedSection = `

**PERSONALIZED USER PROFILE:**
This analysis is for a specific user with the following profile:
${personalContext.map(c => `- ${c}`).join('\n')}

**PERSONALIZATION INSTRUCTIONS:**
- Tailor your recommendations to their specific goal${profile.primary_goal ? ` of ${goalDescriptions[profile.primary_goal]}` : ''}
- Consider how this food might affect their specific symptoms${profile.symptoms?.length ? ` (especially ${profile.symptoms.slice(0, 3).map(s => symptomDescriptions[s] || s).join(', ')})` : ''}
- If this is one of their "guilt foods", be understanding but honest about how to enjoy it responsibly
- Adjust portion/frequency recommendations based on their activity level
- Make recommendations feel supportive, not restrictive`;
  }

  return basePrompt + personalizedSection + '\n\nAlways provide actionable recommendations specific to PCOS management.';
}

const USER_PROMPT = `Analyze this food image for a woman with PCOS. Identify the food and provide a comprehensive analysis.

Respond ONLY with a valid JSON object in this exact format (no markdown, no code blocks, just pure JSON):
{
  "name": "Name of the food/dish",
  "status": "safe" | "caution" | "avoid",
  "summary": "A 1-2 sentence summary of why this food is safe/caution/avoid for PCOS, personalized to the user if profile provided",
  "ingredients": ["ingredient1", "ingredient2", ...],
  "analysis": {
    "glycemic_index": "low" | "medium" | "high",
    "sugar_content": "low" | "moderate" | "high",
    "inflammatory_score": 1-10,
    "hormone_impact": "positive" | "neutral" | "negative",
    "fiber_content": "low" | "moderate" | "high",
    "protein_quality": "low" | "moderate" | "high",
    "healthy_fats": true | false,
    "processed_level": "minimally" | "moderately" | "highly",
    "recommendations": ["personalized recommendation1", "personalized recommendation2", ...],
    "warnings": ["warning1", "warning2", ...]
  },
  "calories": estimated calories (number or null),
  "protein": estimated grams (number or null),
  "carbs": estimated grams (number or null),
  "fat": estimated grams (number or null)
}

If you cannot identify the food or the image doesn't contain food, respond with:
{
  "error": "Description of the issue"
}`;

// Send Expo push notification
async function sendPushNotification(
  pushToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<void> {
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: pushToken,
        title,
        body,
        data,
        sound: 'default',
        priority: 'high',
      }),
    });

    if (!response.ok) {
      console.error('Failed to send push notification:', await response.text());
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

async function analyzeWithOpenAI(
  imageBase64: string,
  openaiKey: string,
  userProfile: OnboardingProfile | null,
  language: string = 'en'
): Promise<AnalysisResult> {
  const systemPrompt = buildPersonalizedPrompt(userProfile, language);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: USER_PROMPT,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response from OpenAI');
  }

  // Parse the JSON response
  try {
    const parsed = JSON.parse(content);

    if (parsed.error) {
      throw new Error(parsed.error);
    }

    return parsed as AnalysisResult;
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', content);
    throw new Error('Failed to parse analysis response');
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verify user token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user's onboarding profile for personalization
    const { data: onboardingProfile } = await supabase
      .from('onboarding_profiles')
      .select('primary_goal, symptoms, daily_struggles, food_relationship, feel_good_foods, guilt_foods, activity_level')
      .eq('user_id', user.id)
      .single();

    console.log('User profile loaded:', onboardingProfile ? 'yes' : 'no');

    // Get request body
    const body = await req.json();
    const { image_base64, image_url, language = 'en' } = body;

    if (!image_base64 && !image_url) {
      return new Response(
        JSON.stringify({ error: 'No image provided. Send image_base64 or image_url' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let imageData = image_base64;

    // If image_url is provided, fetch and convert to base64
    if (image_url && !image_base64) {
      const imageResponse = await fetch(image_url);
      const arrayBuffer = await imageResponse.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < uint8Array.length; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      imageData = btoa(binary);
    }

    // Analyze with OpenAI (with personalized profile and language)
    console.log('Analyzing food image for user:', user.id, 'language:', language);
    const analysis = await analyzeWithOpenAI(imageData, openaiKey, onboardingProfile, language);
    console.log('Analysis complete:', analysis.name);

    // Upload image to storage if base64 was provided
    let storedImageUrl: string | undefined;
    if (image_base64) {
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const imageBuffer = Uint8Array.from(atob(image_base64), c => c.charCodeAt(0));

      const { error: uploadError } = await supabase.storage
        .from('scans')
        .upload(fileName, imageBuffer, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (uploadError) {
        console.error('Failed to upload image:', uploadError);
      } else {
        const { data: urlData } = supabase.storage
          .from('scans')
          .getPublicUrl(fileName);
        storedImageUrl = urlData.publicUrl;
      }
    }

    // Create scan record in database
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .insert({
        user_id: user.id,
        name: analysis.name,
        image_url: storedImageUrl || image_url,
        status: analysis.status,
        summary: analysis.summary,
        ingredients: analysis.ingredients,
        analysis: analysis.analysis,
        calories: analysis.calories,
        protein: analysis.protein,
        carbs: analysis.carbs,
        fat: analysis.fat,
        is_favorite: false,
        scanned_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (scanError) {
      console.error('Failed to save scan:', scanError);
      return new Response(
        JSON.stringify({ error: 'Failed to save scan result' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send push notification if user has a push token
    const { data: account } = await supabase
      .from('accounts')
      .select('push_token')
      .eq('id', user.id)
      .single();

    if (account?.push_token) {
      const statusEmoji = analysis.status === 'safe' ? '✅' : analysis.status === 'caution' ? '⚠️' : '🚫';
      await sendPushNotification(
        account.push_token,
        `${statusEmoji} Scan Complete`,
        `${analysis.name}: ${analysis.summary.slice(0, 100)}${analysis.summary.length > 100 ? '...' : ''}`,
        { scanId: scan.id, type: 'scan_complete' }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        scan,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
