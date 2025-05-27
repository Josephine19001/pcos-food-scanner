export const HAIR_STYLE_TYPES = [
  'Protective Style',
  'Leave-out',
  'Wig',
  'Braids',
  'Twists',
  'Locs',
  'Sew-in',
  'Natural (Out)',
  'Relaxed',
  'Cornrows',
] as const;

export type HairStyleType = (typeof HAIR_STYLE_TYPES)[number];
