export interface BeautyFact {
  id: string;
  fact: string;
  category: 'ingredient' | 'science' | 'history' | 'myth' | 'safety';
  emoji: string;
}

export const BEAUTY_FACTS: BeautyFact[] = [
  {
    id: '1',
    fact: 'Niacinamide reduces sebum production by 30% and minimizes pore appearance',
    category: 'ingredient',
    emoji: '🧴',
  },
  {
    id: '2',
    fact: 'Retinol accelerates cell turnover but causes initial dryness and peeling',
    category: 'ingredient',
    emoji: '💊',
  },
  {
    id: '3',
    fact: 'Salicylic acid penetrates oil-filled pores to dissolve blackheads effectively',
    category: 'ingredient',
    emoji: '🧬',
  },
  {
    id: '4',
    fact: 'Hyaluronic acid pulls moisture from air but can dehydrate skin in dry climates',
    category: 'ingredient',
    emoji: '💧',
  },
  {
    id: '5',
    fact: 'Vitamin C brightens skin but degrades rapidly when exposed to light and air',
    category: 'ingredient',
    emoji: '🍊',
  },
  {
    id: '6',
    fact: 'Glycolic acid removes dead skin cells but increases sun sensitivity for 7 days',
    category: 'ingredient',
    emoji: '🌟',
  },
  {
    id: '7',
    fact: 'Ceramides strengthen skin barrier but work best with cholesterol and fatty acids',
    category: 'ingredient',
    emoji: '🛡️',
  },
  {
    id: '8',
    fact: 'Benzoyl peroxide kills acne bacteria but can bleach fabrics and hair',
    category: 'ingredient',
    emoji: '⚗️',
  },
  {
    id: '9',
    fact: 'Zinc oxide provides broad-spectrum sun protection without chemical absorption',
    category: 'ingredient',
    emoji: '☀️',
  },
  {
    id: '10',
    fact: 'Kojic acid lightens dark spots but may cause contact dermatitis in sensitive skin',
    category: 'ingredient',
    emoji: '✨',
  },
  {
    id: '11',
    fact: 'Salicylic acid comes from willow bark and was used by ancient Greeks for pain relief',
    category: 'history',
    emoji: '🌳',
  },
  {
    id: '12',
    fact: 'Fragrance is the #1 cause of contact dermatitis in cosmetic products',
    category: 'safety',
    emoji: '🌸',
  },
  {
    id: '13',
    fact: 'Bakuchiol provides retinol-like benefits but is pregnancy-safe and derived from plants',
    category: 'ingredient',
    emoji: '🌱',
  },
  {
    id: '14',
    fact: 'SPF 30 blocks 97% of UV rays, while SPF 50 only blocks 98% - diminishing returns',
    category: 'science',
    emoji: '☀️',
  },
  {
    id: '15',
    fact: 'Ceramides make up 50% of your skin barrier and decrease 40% as you age',
    category: 'science',
    emoji: '🧴',
  },
  {
    id: '16',
    fact: 'Zinc oxide was used as white face paint by ancient civilizations before becoming sunscreen',
    category: 'history',
    emoji: '🎭',
  },
  {
    id: '17',
    fact: 'Alpha hydroxy acids (AHAs) were discovered when workers in sugar mills had softer hands',
    category: 'history',
    emoji: '🍯',
  },
  {
    id: '18',
    fact: 'Kojic acid, a popular brightening ingredient, is actually a byproduct of rice wine production',
    category: 'ingredient',
    emoji: '🍶',
  },
  {
    id: '19',
    fact: 'Clean beauty is a marketing term with no legal definition or safety standards',
    category: 'myth',
    emoji: '🏷️',
  },
  {
    id: '20',
    fact: 'Argan oil contains more Vitamin E than any other plant oil in the world',
    category: 'ingredient',
    emoji: '🌰',
  },
  {
    id: '21',
    fact: 'Mineral sunscreens reflect UV rays while chemical sunscreens absorb and convert them',
    category: 'science',
    emoji: '🪞',
  },
  {
    id: '22',
    fact: 'Squalane used to come from shark liver oil but now comes from sugarcane or olives',
    category: 'ingredient',
    emoji: '🦈',
  },
  {
    id: '23',
    fact: 'Glycolic acid molecules are so small they can penetrate deeper than any other AHA',
    category: 'science',
    emoji: '🔍',
  },
  {
    id: '24',
    fact: 'Benzoyl peroxide bleaches fabric but was originally used to bleach flour',
    category: 'history',
    emoji: '🍞',
  },
  {
    id: '25',
    fact: 'The EU bans 1,600+ ingredients in cosmetics while the US only bans 11',
    category: 'safety',
    emoji: '🚫',
  },
];

export function getDailyBeautyFact(): BeautyFact {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = dayOfYear % BEAUTY_FACTS.length;
  return BEAUTY_FACTS[index];
}

export function getRandomBeautyFact(): BeautyFact {
  const index = Math.floor(Math.random() * BEAUTY_FACTS.length);
  return BEAUTY_FACTS[index];
}

export function getBeautyFactsByCategory(category: BeautyFact['category']): BeautyFact[] {
  return BEAUTY_FACTS.filter((fact) => fact.category === category);
}
