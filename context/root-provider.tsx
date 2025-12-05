import type { PropsWithChildren } from 'react';

import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';
import { AuthProvider } from './auth-provider';
import { RevenueCatProvider } from './revenuecat-provider';
import { NotificationProvider } from './notification-provider';
import { PendingScanProvider } from './pending-scan-provider';
import { ThemeProvider } from './theme-provider';
import { TabBarProvider } from './tab-bar-provider';
import { LanguageProvider } from './language-provider';
import { OnboardingProvider } from './onboarding-provider';
import '@/lib/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const RootProvider = ({ children }: PropsWithChildren) => {
  useReactQueryDevTools(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <OnboardingProvider>
              <RevenueCatProvider>
                <NotificationProvider>
                  <PendingScanProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                      <BottomSheetModalProvider>
                        <TabBarProvider>
                          {children}
                          <Toaster
                            theme="light"
                            toastOptions={{
                              style: {
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                              },
                              titleStyle: {
                                fontSize: 14,
                                fontWeight: '600',
                              },
                              descriptionStyle: {
                                fontSize: 12,
                              },
                            }}
                          />
                        </TabBarProvider>
                      </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                  </PendingScanProvider>
                </NotificationProvider>
              </RevenueCatProvider>
            </OnboardingProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
