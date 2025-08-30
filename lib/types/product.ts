import type { PRODUCT_TYPE } from '@/constants/product-type';

export type Product = {
  id: string;
  brand: string;
  name: string;
  type: (typeof PRODUCT_TYPE)[keyof typeof PRODUCT_TYPE];
  size: string;
  barcode: string;
  for: string;
  description: string;
  sulfate_free: boolean;
  silicone_free: boolean;
  cruelty_free: boolean;
  made_in: string;
  ingredients: {
    name: string;
    purpose: string;
    effect: string;
  }[];
  suggestedFor: {
    hairGoals: {
      Longer: boolean;
      Healthier: boolean;
      'Defined curls': boolean;
      'Protective styling': boolean;
      'Edge growth': boolean;
      'All of the above': boolean;
    };
    porosity: {
      High: boolean;
      Mid: boolean;
      Low: boolean;
    };
    routine: {
      Daily: boolean;
      Weekly: boolean;
      'During protective style': boolean;
    };
  };
};

export interface ScannedProduct {
  id: string;
  user_id: string;
  name: string;
  brand: string;
  category: string;
  safety_score: number;
  image_url: string;
  ingredients: string[];
  key_ingredients: Array<{
    name: string;
    type: 'beneficial' | 'harmful' | 'neutral';
    description?: string;
    effect?: string;
  }>;
  cycle_insights?: {
    menstrual_phase: {
      recommended: boolean;
      reason: string;
    };
    follicular_phase: {
      recommended: boolean;
      reason: string;
    };
    ovulatory_phase: {
      recommended: boolean;
      reason: string;
    };
    luteal_phase: {
      recommended: boolean;
      reason: string;
    };
  };
  hormone_impact?: {
    may_worsen_pms: boolean;
    may_cause_breakouts: boolean;
    good_for_sensitive_skin: boolean;
    description: string;
  };
  product_links?: Array<{
    title: string;
    url: string;
    source: string;
    thumbnailUrl?: string;
  }>;
  scanned_at: string;
  is_favorite: boolean;
}

// For UI components that need camelCase (legacy compatibility)
export interface ScannedProductUI {
  id: string;
  name: string;
  brand: string;
  category: string;
  safetyScore: number;
  image: any; // For local images
  ingredients: string[];
  keyIngredients: Array<{
    name: string;
    type: 'beneficial' | 'harmful' | 'neutral';
    description?: string;
    effect?: string;
  }>;
  cycleInsights?: {
    menstrualPhase: {
      recommended: boolean;
      reason: string;
    };
    follicularPhase: {
      recommended: boolean;
      reason: string;
    };
    ovulatoryPhase: {
      recommended: boolean;
      reason: string;
    };
    lutealPhase: {
      recommended: boolean;
      reason: string;
    };
  };
  hormoneImpact?: {
    mayWorsenPms: boolean;
    mayCauseBreakouts: boolean;
    goodForSensitiveSkin: boolean;
    description: string;
  };
  productLinks?: Array<{
    title: string;
    url: string;
    source: string;
    thumbnailUrl?: string;
  }>;
  isFavorite?: boolean;
  scannedAt?: string;
  savedAt?: string;
}

// API response from Edge Function
export interface ProductAnalysisResult {
  name: string;
  brand: string;
  category: string;
  category_description: string;
  safety_score: number;
  image_url: string;
  ingredients: string[];
  key_ingredients: Array<{
    name: string;
    type: 'beneficial' | 'harmful' | 'neutral';
    description: string;
  }>;
  product_links?: Array<{
    title: string;
    url: string;
    source: string;
    thumbnailUrl?: string;
  }>;
}

// Utility function to convert API result to UI format
export function convertToUIFormat(
  apiResult: ProductAnalysisResult,
  localImage: any,
  id?: string
): ScannedProductUI {
  return {
    id: id || Date.now().toString(),
    name: apiResult.name,
    brand: apiResult.brand,
    category: apiResult.category,
    safetyScore: apiResult.safety_score,
    image: localImage,
    ingredients: apiResult.ingredients,
    keyIngredients: apiResult.key_ingredients,
    productLinks: apiResult.product_links,
    isFavorite: false,
  };
}

// Utility function to convert ScannedProduct (from DB) to ScannedProductUI (for UI)
export function convertScannedProductToUI(product: ScannedProduct): ScannedProductUI {
  return {
    id: product.id || '',
    name: product.name || 'Unknown Product',
    brand: product.brand || 'Unknown Brand',
    category: product.category || 'Unknown Category',
    safetyScore: product.safety_score || 0,
    image: product.image_url || '',
    ingredients: product.ingredients || [],
    keyIngredients: product.key_ingredients || [],
    productLinks: product.product_links || [],
    isFavorite: product.is_favorite || false,
    scannedAt: product.scanned_at || '',
  };
}

// Utility function to convert UI format to database format
export function convertToDBFormat(
  uiProduct: ScannedProductUI,
  userId: string,
  imageUrl: string
): Omit<ScannedProduct, 'id' | 'scanned_at'> {
  return {
    user_id: userId,
    name: uiProduct.name,
    brand: uiProduct.brand,
    category: uiProduct.category,
    safety_score: uiProduct.safetyScore,
    image_url: imageUrl,
    ingredients: uiProduct.ingredients,
    key_ingredients: uiProduct.keyIngredients,
    product_links: uiProduct.productLinks,
    is_favorite: uiProduct.isFavorite || false,
  };
}
