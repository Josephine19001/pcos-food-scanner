export const queryKeys = {
  accounts: {
    all: ['accounts'] as const,
    detail: () => [...queryKeys.accounts.all, 'detail'] as const,
    subscription: () => [...queryKeys.accounts.all, 'subscription'] as const,
  },
} as const;
