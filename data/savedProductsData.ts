import { ScannedProductUI } from '@/lib/types/product';

export const mockSavedProducts: ScannedProductUI[] = [
  {
    id: '1',
    name: 'Hydrating Serum',
    brand: 'GlowCo',
    category: 'Skincare',
    safetyScore: 8,
    scannedAt: '2024-01-15T10:30:00Z',
    savedAt: '2024-01-15T10:30:00Z',
    isFavorite: true,
    image: require('@/assets/images/product.png'),
    ingredients: [
      'Water',
      'Hyaluronic Acid',
      'Glycerin',
      'Niacinamide',
      'Panthenol',
      'Allantoin',
      'Sodium Hyaluronate',
      'Phenoxyethanol',
      'Ethylhexylglycerin',
    ],
    keyIngredients: [
      {
        name: 'Hyaluronic Acid',
        type: 'beneficial',
        description:
          'Powerful humectant that can hold up to 1000 times its weight in water, providing intense hydration.',
      },
      {
        name: 'Niacinamide',
        type: 'beneficial',
        description:
          'Vitamin B3 that helps regulate oil production, minimize pores, and improve skin texture.',
      },
      {
        name: 'Phenoxyethanol',
        type: 'neutral',
        description: 'Preservative that prevents bacterial growth in cosmetic products.',
      },
    ],
    productLinks: [
      {
        title: 'GlowCo Hydrating Serum - Sephora',
        url: 'https://www.sephora.com/product/hydrating-serum',
        source: 'Sephora',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=100&h=100&fit=crop&crop=center',
      },
      {
        title: 'Hydrating Serum 30ml - Ulta Beauty',
        url: 'https://www.ulta.com/p/hydrating-serum',
        source: 'Ulta Beauty',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop&crop=center',
      },
      {
        title: 'GlowCo Hydrating Serum - Amazon',
        url: 'https://www.amazon.com/glowco-hydrating-serum',
        source: 'Amazon',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=100&h=100&fit=crop&crop=center',
      },
    ],
  },
  {
    id: '2',
    name: 'Vitamin C Brightening Cream',
    brand: 'RadiantSkin',
    category: 'Skincare',
    safetyScore: 9,
    scannedAt: '2024-01-14T14:20:00Z',
    savedAt: '2024-01-14T14:20:00Z',
    isFavorite: false,
    image: require('@/assets/images/product.png'),
    ingredients: [
      'Water',
      'Ascorbic Acid',
      'Magnesium Ascorbyl Phosphate',
      'Glycerin',
      'Squalane',
      'Tocopheryl Acetate',
      'Ferulic Acid',
      'Hyaluronic Acid',
      'Phenoxyethanol',
    ],
    keyIngredients: [
      {
        name: 'Ascorbic Acid',
        type: 'beneficial',
        description:
          'Pure Vitamin C that brightens skin, reduces dark spots, and provides antioxidant protection.',
      },
      {
        name: 'Ferulic Acid',
        type: 'beneficial',
        description:
          'Antioxidant that stabilizes Vitamin C and provides additional protection against environmental damage.',
      },
      {
        name: 'Tocopheryl Acetate',
        type: 'beneficial',
        description:
          'Vitamin E derivative that provides antioxidant benefits and helps maintain skin barrier.',
      },
    ],
    productLinks: [
      {
        title: 'RadiantSkin Vitamin C Brightening Cream - Dermstore',
        url: 'https://www.dermstore.com/radiantskin-vitamin-c-cream',
        source: 'Dermstore',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=100&h=100&fit=crop&crop=center',
      },
      {
        title: 'Vitamin C Brightening Cream 50ml - Target',
        url: 'https://www.target.com/p/radiantskin-vitamin-c-cream',
        source: 'Target',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop&crop=center',
      },
    ],
  },
  {
    id: '3',
    name: 'Gentle Cleansing Foam',
    brand: 'PureSkin',
    category: 'Cleanser',
    safetyScore: 7,
    scannedAt: '2024-01-13T09:15:00Z',
    savedAt: '2024-01-13T09:15:00Z',
    isFavorite: true,
    image: require('@/assets/images/product.png'),
    ingredients: [
      'Water',
      'Sodium Cocoyl Isethionate',
      'Cocamidopropyl Betaine',
      'Glycerin',
      'Sodium Chloride',
      'Panthenol',
      'Allantoin',
      'Citric Acid',
      'Phenoxyethanol',
      'Fragrance',
    ],
    keyIngredients: [
      {
        name: 'Sodium Cocoyl Isethionate',
        type: 'beneficial',
        description:
          'Gentle surfactant derived from coconut that cleanses without stripping the skin.',
      },
      {
        name: 'Panthenol',
        type: 'beneficial',
        description:
          'Pro-Vitamin B5 that soothes and moisturizes the skin while reducing irritation.',
      },
      {
        name: 'Fragrance',
        type: 'harmful',
        description: 'Can cause allergic reactions and skin sensitivity in some individuals.',
      },
    ],
    productLinks: [
      {
        title: 'PureSkin Gentle Cleansing Foam - CVS Pharmacy',
        url: 'https://www.cvs.com/shop/pureskin-cleansing-foam',
        source: 'CVS Pharmacy',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop&crop=center',
      },
      {
        title: 'Gentle Cleansing Foam 150ml - Walgreens',
        url: 'https://www.walgreens.com/store/c/pureskin-foam',
        source: 'Walgreens',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=100&h=100&fit=crop&crop=center',
      },
      {
        title: 'PureSkin Cleansing Foam - Official Website',
        url: 'https://www.pureskin.com/products/cleansing-foam',
        source: 'PureSkin',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center',
      },
    ],
  },
  {
    id: '4',
    name: 'Anti-Aging Night Cream',
    brand: 'TimelessBeauty',
    category: 'Skincare',
    safetyScore: 6,
    scannedAt: '2024-01-12T20:45:00Z',
    savedAt: '2024-01-12T20:45:00Z',
    isFavorite: false,
    image: require('@/assets/images/product.png'),
    ingredients: [
      'Water',
      'Retinol',
      'Glycerin',
      'Squalane',
      'Peptides',
      'Hyaluronic Acid',
      'Ceramides',
      'Niacinamide',
      'Phenoxyethanol',
      'BHT',
    ],
    keyIngredients: [
      {
        name: 'Retinol',
        type: 'beneficial',
        description: 'Vitamin A derivative that promotes cell turnover and reduces signs of aging.',
      },
      {
        name: 'Peptides',
        type: 'beneficial',
        description:
          'Amino acid chains that help stimulate collagen production and improve skin firmness.',
      },
      {
        name: 'BHT',
        type: 'harmful',
        description:
          'Synthetic antioxidant that may cause skin irritation and has potential health concerns.',
      },
    ],
  },
  {
    id: '5',
    name: 'Moisturizing Sunscreen SPF 50',
    brand: 'SunGuard',
    category: 'Sunscreen',
    safetyScore: 8,
    scannedAt: '2024-01-11T11:30:00Z',
    savedAt: '2024-01-11T11:30:00Z',
    isFavorite: true,
    image: require('@/assets/images/product.png'),
    ingredients: [
      'Water',
      'Zinc Oxide',
      'Titanium Dioxide',
      'Glycerin',
      'Squalane',
      'Hyaluronic Acid',
      'Vitamin E',
      'Aloe Vera Extract',
      'Phenoxyethanol',
    ],
    keyIngredients: [
      {
        name: 'Zinc Oxide',
        type: 'beneficial',
        description:
          'Mineral sunscreen ingredient that provides broad-spectrum UV protection without irritation.',
      },
      {
        name: 'Titanium Dioxide',
        type: 'beneficial',
        description:
          'Mineral UV filter that reflects and scatters UV rays, suitable for sensitive skin.',
      },
      {
        name: 'Aloe Vera Extract',
        type: 'beneficial',
        description:
          'Natural ingredient that soothes and hydrates the skin while providing anti-inflammatory benefits.',
      },
    ],
    productLinks: [
      {
        title: 'SunGuard SPF 50 Sunscreen - Beach & Pool Supply',
        url: 'https://www.beachsupply.com/sunguard-spf50',
        source: 'Beach Supply',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544966503-7e2dcbbc6b5e?w=100&h=100&fit=crop&crop=center',
      },
      {
        title: 'Moisturizing Sunscreen SPF 50 - Amazon',
        url: 'https://www.amazon.com/sunguard-sunscreen-spf50',
        source: 'Amazon',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=100&h=100&fit=crop&crop=center',
      },
    ],
  },
  {
    id: '6',
    name: 'Exfoliating Toner',
    brand: 'ClearSkin',
    category: 'Toner',
    safetyScore: 7,
    scannedAt: '2024-01-10T16:20:00Z',
    savedAt: '2024-01-10T16:20:00Z',
    isFavorite: false,
    image: require('@/assets/images/product.png'),
    ingredients: [
      'Water',
      'Salicylic Acid',
      'Glycolic Acid',
      'Witch Hazel',
      'Niacinamide',
      'Panthenol',
      'Sodium Hyaluronate',
      'Phenoxyethanol',
      'Alcohol Denat',
    ],
    keyIngredients: [
      {
        name: 'Salicylic Acid',
        type: 'beneficial',
        description:
          'Beta hydroxy acid that penetrates pores to remove dead skin cells and reduce acne.',
      },
      {
        name: 'Glycolic Acid',
        type: 'beneficial',
        description:
          'Alpha hydroxy acid that exfoliates the skin surface to improve texture and brightness.',
      },
      {
        name: 'Alcohol Denat',
        type: 'harmful',
        description:
          'Drying alcohol that can strip the skin barrier and cause irritation with frequent use.',
      },
    ],
  },
];

export const getFavoriteProducts = (products: ScannedProductUI[]): ScannedProductUI[] => {
  return products.filter((product) => product.isFavorite);
};

export const getScannedProducts = (products: ScannedProductUI[]): ScannedProductUI[] => {
  return products.filter((product) => !product.isFavorite);
};
