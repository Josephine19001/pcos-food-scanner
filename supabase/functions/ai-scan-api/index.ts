import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import OpenAI from 'npm:openai';

export interface ScannedProductUI {
  id: string;
  name: string;
  brand: string;
  category: string;
  safetyScore: number;
  image: string;
  ingredients: string[];
  keyIngredients: Array<{
    name: string;
    type: 'beneficial' | 'harmful' | 'neutral';
    description: string;
  }>;
  productLinks?: Array<{
    title: string;
    url: string;
    source: string;
    thumbnailUrl?: string | null;
  }>;
  isFavorite?: boolean;
  scannedAt?: string;
  savedAt?: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY') ?? '',
});

function jsonError(message: string, status: number = 500) {
  return new Response(
    JSON.stringify({
      error: message,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

async function uploadBase64Image(dataUrl: string): Promise<string> {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) throw new Error('Invalid base64 image format');

  const [, mimeType, base64] = match;
  const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const ext = mimeType.split('/')[1];
  const filename = `scan-${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from('product-images').upload(filename, buffer, {
    contentType: mimeType,
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(filename);
  if (!data || !data.publicUrl) {
    throw new Error('Could not get public URL for uploaded image.');
  }
  return data.publicUrl;
}

async function searchWithSerper(imageUrl: string) {
  const serperApiKey = Deno.env.get('SERPER_API_KEY');
  if (!serperApiKey) {
    throw new Error('SERPER_API_KEY is not set in environment variables.');
  }

  const res = await fetch('https://google.serper.dev/lens', {
    method: 'POST',
    headers: {
      'X-API-KEY': serperApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: imageUrl,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Serper error: ${errorText}`);
  }

  const result = await res.json();

  const productLinks = (result.organic ?? [])
    .slice(0, 3)
    .map((item: any) => ({
      title: item.title || 'Product',
      url: item.link || '',
      source: item.source || 'Unknown',
      thumbnailUrl: item.thumbnailUrl || item.imageUrl || null,
    }))
    .filter((link: any) => link.title && link.url);

  const productName = productLinks.length > 0 ? productLinks[0].title : 'Unknown Product';

  return {
    productLinks,
    productName,
  };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return jsonError('Method Not Allowed', 405);
  }

  try {
    const { image_url }: { image_url: string } = await req.json();

    if (!image_url) {
      return jsonError('image_url is required', 400);
    }

    const finalImageUrl = image_url.startsWith('data:image/')
      ? await uploadBase64Image(image_url)
      : image_url;

    const { productLinks, productName } = await searchWithSerper(finalImageUrl);

    let gptResult: Partial<ScannedProductUI> = {};

    try {
      const jsonSchema = {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'The name of the beauty product.' },
          brand: { type: 'string', description: 'The brand of the beauty product.' },
          category: {
            type: 'string',
            description:
              'The category of the beauty product (e.g., Skincare, Haircare, Makeup, Fragrance).',
          },
          safetyScore: {
            type: 'number',
            description: 'A safety score for the product from 1 to 10, where 10 is safest.',
          },
          ingredients: {
            type: 'array',
            items: { type: 'string' },
            description: 'A list of all ingredients in the product.',
          },
          keyIngredients: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                type: { type: 'string', enum: ['beneficial', 'harmful', 'neutral'] },
                description: { type: 'string' },
              },
              required: ['name', 'type', 'description'],
            },
            description:
              'A list of key ingredients with their type (beneficial, harmful, neutral) and a brief description.',
          },
          productLinks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                url: { type: 'string' },
                source: { type: 'string' },
              },
              required: ['title', 'url', 'source'],
            },
            description: 'Relevant product links found during analysis.',
          },
        },
        required: ['name', 'brand', 'category', 'safetyScore', 'ingredients', 'keyIngredients'],
      };

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are an expert beauty product analyst. Your task is to analyze beauty products based on provided information and return a structured JSON object. Focus on identifying ingredients, assessing safety, and categorizing the product. Ensure the output strictly follows the provided JSON schema. If information is not available, use "Unknown" or provide a reasonable default. Safety score should be between 1 and 10. For keyIngredients, provide at least 3-5 key ingredients if possible, classifying them as 'beneficial', 'harmful', or 'neutral'.`,
          },
          {
            role: 'user',
            content: `Analyze this beauty product based on the following:
            
            Product Name: ${productName}
            Available Product Links (for ingredient and product information, if available): ${JSON.stringify(productLinks, null, 2)}
            
            Based on this information, provide a comprehensive analysis. Look up ingredients and product details from the provided links or general knowledge.
            `,
          },
        ],
        temperature: 0.7,
      });

      const messageContent = response.choices[0].message?.content;
      if (messageContent) {
        gptResult = JSON.parse(messageContent);
      } else {
        throw new Error('OpenAI response content was empty.');
      }
    } catch (error) {
      return new Response(
        JSON.stringify({
          id: crypto.randomUUID(),
          name: productName || 'Unknown Product',
          brand: 'Unknown Brand',
          category: 'Analysis Failed',
          safetyScore: 1,
          image: finalImageUrl,
          ingredients: [],
          keyIngredients: [
            {
              name: 'Analysis Failed',
              type: 'harmful',
              description:
                'Failed to analyze product information. Please try again or provide more details.',
            },
          ],
          productLinks:
            productLinks.length > 0
              ? productLinks
              : [
                  {
                    title: 'Search for this product',
                    url: `https://www.google.com/search?q=${encodeURIComponent(productName)}`,
                    source: 'Google',
                    thumbnailUrl: null,
                  },
                ],
          isFavorite: false,
          scannedAt: new Date().toISOString(),
          savedAt: null,
        } as ScannedProductUI),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const scannedProduct: ScannedProductUI = {
      id: crypto.randomUUID(),
      name: gptResult.name || productName || 'Unknown Product',
      brand: gptResult.brand || 'Unknown Brand',
      category: gptResult.category || 'Other',
      safetyScore: typeof gptResult.safetyScore === 'number' ? gptResult.safetyScore : 6,
      image: finalImageUrl,
      ingredients: Array.isArray(gptResult.ingredients) ? gptResult.ingredients : [],
      keyIngredients:
        Array.isArray(gptResult.keyIngredients) && gptResult.keyIngredients.length > 0
          ? gptResult.keyIngredients
          : [
              {
                name: 'Analysis Pending',
                type: 'neutral',
                description: 'Ingredient analysis is being processed. Please try scanning again.',
              },
            ],
      productLinks:
        Array.isArray(gptResult.productLinks) && gptResult.productLinks.length > 0
          ? gptResult.productLinks
          : productLinks.length > 0
            ? productLinks
            : [
                {
                  title: 'Search for this product',
                  url: `https://www.google.com/search?q=${encodeURIComponent(productName)}`,
                  source: 'Google',
                  thumbnailUrl: null,
                },
              ],
      isFavorite: false,
      scannedAt: new Date().toISOString(),
      savedAt: null,
    };

    return new Response(JSON.stringify(scannedProduct), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    return jsonError(err.message || 'Unexpected internal server error');
  }
});
