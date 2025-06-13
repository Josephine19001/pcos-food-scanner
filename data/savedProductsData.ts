import type { SavedProduct } from '@/components/saves/ProductCard';

export const mockSavedProducts: SavedProduct[] = [
  {
    id: '1',
    name: "Fenty Beauty Pro Filt'r Foundation",
    brand: 'Fenty Beauty',
    category: 'Face',
    safetyScore: 8,
    scannedAt: '2024-01-15',
    isFavorite: true,
    image: require('@/assets/onboarding/example-icon.png'),
    ingredients: [
      'Water',
      'Dimethicone',
      'Glycerin',
      'Butylene Glycol',
      'Phenoxyethanol',
      'Sodium Hyaluronate',
      'Tocopheryl Acetate',
      'Panthenol',
      'Allantoin',
      'Carbomer',
      'Triethanolamine',
      'Disodium EDTA',
      'Fragrance',
    ],
    keyIngredients: [
      {
        name: 'Sodium Hyaluronate',
        type: 'beneficial',
        description:
          'A powerful humectant that can hold up to 1000 times its weight in water, providing excellent hydration and plumping effects for the skin.',
      },
      {
        name: 'Tocopheryl Acetate (Vitamin E)',
        type: 'beneficial',
        description:
          'An antioxidant that helps protect skin from environmental damage and provides moisturizing benefits.',
      },
      {
        name: 'Phenoxyethanol',
        type: 'neutral',
        description:
          'A widely used preservative that prevents bacterial growth. Generally well-tolerated but may cause irritation in very sensitive individuals.',
      },
      {
        name: 'Fragrance',
        type: 'harmful',
        description:
          'Can be a potential allergen and irritant, especially for sensitive skin types. Consider patch testing if you have fragrance sensitivities.',
      },
    ],
  },
  {
    id: '2',
    name: 'Olaplex No. 3 Hair Perfector',
    brand: 'Olaplex',
    category: 'Hair',
    safetyScore: 9,
    scannedAt: '2024-01-14',
    isFavorite: false,
    image: require('@/assets/onboarding/example-icon.png'),
    ingredients: [
      'Water',
      'Bis-Aminopropyl Diglycol Dimaleate',
      'Phenoxyethanol',
      'Sodium Benzoate',
      'Citric Acid',
      'Disodium EDTA',
    ],
    keyIngredients: [
      {
        name: 'Bis-Aminopropyl Diglycol Dimaleate',
        type: 'beneficial',
        description:
          "Olaplex's patented bond-building ingredient that helps repair and strengthen damaged hair by reconnecting broken disulfide bonds.",
      },
      {
        name: 'Citric Acid',
        type: 'beneficial',
        description:
          'Helps balance pH levels and can smooth the hair cuticle, resulting in shinier and more manageable hair.',
      },
      {
        name: 'Phenoxyethanol',
        type: 'neutral',
        description:
          'A preservative that keeps the product safe from harmful bacteria. Generally well-tolerated on the scalp.',
      },
    ],
  },
  {
    id: '3',
    name: 'Drunk Elephant C-Firma Day Serum',
    brand: 'Drunk Elephant',
    category: 'Skin',
    safetyScore: 7,
    scannedAt: '2024-01-13',
    isFavorite: true,
    image: require('@/assets/onboarding/example-icon.png'),
    ingredients: [
      'Water',
      'L-Ascorbic Acid',
      'Glycerin',
      'Propanediol',
      'Alpha Arbutin',
      'Sodium Hyaluronate Crosspolymer',
      'Tocopherol',
      'Ferulic Acid',
      'Sodium Hydroxide',
      'Phenoxyethanol',
      'Ethylhexylglycerin',
    ],
    keyIngredients: [
      {
        name: 'L-Ascorbic Acid (Vitamin C)',
        type: 'beneficial',
        description:
          'A potent antioxidant that brightens skin, stimulates collagen production, and helps fade dark spots and hyperpigmentation.',
      },
      {
        name: 'Ferulic Acid',
        type: 'beneficial',
        description:
          'An antioxidant that stabilizes vitamin C and provides additional protection against environmental damage.',
      },
      {
        name: 'Alpha Arbutin',
        type: 'beneficial',
        description:
          'A gentle skin-brightening ingredient that helps reduce the appearance of dark spots and hyperpigmentation.',
      },
      {
        name: 'Sodium Hydroxide',
        type: 'harmful',
        description:
          "Used to adjust pH but can be irritating in high concentrations. In this formulation, it's likely used in small amounts but may cause sensitivity.",
      },
    ],
  },
  {
    id: '4',
    name: 'Rare Beauty Soft Matte Lipstick',
    brand: 'Rare Beauty',
    category: 'Face',
    safetyScore: 6,
    savedAt: '2024-01-12',
    isFavorite: true,
    image: require('@/assets/onboarding/example-icon.png'),
    ingredients: [
      'Dimethicone',
      'Isododecane',
      'Cyclopentasiloxane',
      'Trimethylsiloxysilicate',
      'Ceresin',
      'Polyethylene',
      'Kaolin',
      'Silica',
      'Tocopheryl Acetate',
      'Phenoxyethanol',
      'May Contain: CI 77491, CI 77492, CI 77499, CI 15850',
    ],
    keyIngredients: [
      {
        name: 'Tocopheryl Acetate (Vitamin E)',
        type: 'beneficial',
        description: 'Provides antioxidant protection and helps maintain lip moisture and comfort.',
      },
      {
        name: 'Kaolin',
        type: 'beneficial',
        description:
          'A gentle clay that helps absorb excess oils and provides a smooth, matte finish without being overly drying.',
      },
      {
        name: 'Silica',
        type: 'neutral',
        description:
          'Helps create a smooth texture and provides oil absorption for the matte finish. Generally well-tolerated.',
      },
      {
        name: 'CI Colorants',
        type: 'harmful',
        description:
          'Synthetic colorants that may cause allergic reactions in sensitive individuals. Patch test if you have known color sensitivities.',
      },
    ],
  },
  {
    id: '5',
    name: 'The Ordinary Hyaluronic Acid 2% + B5',
    brand: 'The Ordinary',
    category: 'Skin',
    safetyScore: 9,
    savedAt: '2024-01-11',
    isFavorite: false,
    image: require('@/assets/onboarding/example-icon.png'),
    ingredients: [
      'Aqua',
      'Sodium Hyaluronate',
      'Panthenol',
      'Ahnfeltia Concinna Extract',
      'Glycerin',
      'Pentylene Glycol',
      'Propanediol',
      'Polyacrylate Crosspolymer-6',
      'Dimethyl Isosorbide',
      'Hydroxyethylcellulose',
      'Arginine',
      'Phenoxyethanol',
      'Hydroxypropyl Cyclodextrin',
      'Chlorphenesin',
    ],
    keyIngredients: [
      {
        name: 'Sodium Hyaluronate',
        type: 'beneficial',
        description:
          'Multiple molecular weights of hyaluronic acid provide deep and surface-level hydration for plump, smooth skin.',
      },
      {
        name: 'Panthenol (Pro-Vitamin B5)',
        type: 'beneficial',
        description:
          'A soothing ingredient that helps calm irritation, improve skin barrier function, and provide long-lasting hydration.',
      },
      {
        name: 'Ahnfeltia Concinna Extract',
        type: 'beneficial',
        description:
          'A marine extract that helps improve skin elasticity and provides additional hydrating benefits.',
      },
      {
        name: 'Phenoxyethanol',
        type: 'neutral',
        description:
          'A preservative that maintains product safety. Well-tolerated by most skin types in the low concentrations used.',
      },
    ],
  },
  {
    id: '6',
    name: 'Chanel Coco Mademoiselle',
    brand: 'Chanel',
    category: 'Perfume',
    safetyScore: 5,
    scannedAt: '2024-01-10',
    isFavorite: false,
    image: require('@/assets/onboarding/example-icon.png'),
    ingredients: [
      'Alcohol Denat.',
      'Parfum',
      'Aqua',
      'Benzyl Salicylate',
      'Coumarin',
      'Linalool',
      'Alpha-Isomethyl Ionone',
      'Citronellol',
      'Hexyl Cinnamal',
      'Hydroxycitronellal',
      'Geraniol',
      'Citral',
      'Farnesol',
      'Benzyl Benzoate',
    ],
    keyIngredients: [
      {
        name: 'Linalool',
        type: 'harmful',
        description:
          'A common fragrance allergen that can cause skin sensitization and irritation in susceptible individuals. EU requires labeling when present above 0.001%.',
      },
      {
        name: 'Coumarin',
        type: 'harmful',
        description:
          'A fragrance component with a sweet, hay-like scent. Can be allergenic and is required to be listed when present in concentrations above regulatory limits.',
      },
      {
        name: 'Alcohol Denat.',
        type: 'neutral',
        description:
          'Used as a solvent and to help the fragrance project. Can be drying but is standard in perfume formulations.',
      },
      {
        name: 'Citronellol',
        type: 'harmful',
        description:
          'A fragrance ingredient that can cause allergic reactions. Commonly found in rose and citrus scents but must be declared due to allergen potential.',
      },
    ],
  },
];

export const getFavoriteProducts = (products: SavedProduct[]): SavedProduct[] => {
  return products.filter((product) => product.isFavorite);
};

export const getScannedProducts = (products: SavedProduct[]): SavedProduct[] => {
  return products.filter((product) => product.scannedAt);
};
