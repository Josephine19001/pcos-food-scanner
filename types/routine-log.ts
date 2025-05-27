import type { HairStyleType } from '@/constants/hair-styles';

export type RoutineLog = {
  date: string;
  hairLength: number;
  hairStyle: HairStyleType;
  products: {
    id: string;
    name: string;
    brand: string;
    type: string;
    amountUsed: number;
    amountLeft: number;
  }[];
  photos: string[];
  notes?: string;
};
