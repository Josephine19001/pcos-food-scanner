import type { RoutineLog } from '@/types/routine-log';

export const mockRoutineLogs: RoutineLog[] = [
  {
    date: '2024-03-15',
    hairLength: 12,
    hairStyle: 'Natural (Out)',
    products: [
      {
        id: 'prod_001',
        name: 'Moisture Shampoo',
        brand: 'Shea Moisture',
        type: 'Shampoo',
        amountUsed: 30,
        amountLeft: 65,
      },
      {
        id: 'prod_002',
        name: 'Leave-in Conditioner',
        brand: 'Cantu',
        type: 'Leave In',
        amountUsed: 15,
        amountLeft: 45,
      },
    ],
    photos: ['https://example.com/photo1.jpg'],
    notes: 'Hair feels moisturized and healthy',
  },
  // Add more logs...
];
