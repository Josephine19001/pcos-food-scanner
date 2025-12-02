import { Tabs, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Settings, Scan } from 'lucide-react-native';
import { useTabBar } from '@/context/tab-bar-provider';
import * as Haptics from 'expo-haptics';

function CustomTabBar({ state, navigation }: any) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleScanPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/scan');
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row items-end justify-center px-6"
      style={{ paddingBottom: insets.bottom + 10 }}
    >
      {/* Tab Bar Container */}
      <View className="flex-1 h-[64px] rounded-full overflow-hidden bg-white shadow-lg" style={styles.tabBar}>
        <View className="flex-1 flex-row items-center justify-around px-6">
          {/* Home Tab */}
          {state.routes.map((route: any, index: number) => {
            if (route.name === 'scan/index') return null;

            const isFocused = state.index === index;

            const onPress = () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const color = isFocused ? '#0D9488' : '#9CA3AF';

            if (route.name === 'home/index') {
              return (
                <Pressable
                  key={route.key}
                  onPress={onPress}
                  className="items-center justify-center p-3"
                >
                  <Home size={26} color={color} strokeWidth={isFocused ? 2.5 : 2} />
                </Pressable>
              );
            }

            if (route.name === 'settings/index') {
              return (
                <Pressable
                  key={route.key}
                  onPress={onPress}
                  className="items-center justify-center p-3"
                >
                  <Settings size={26} color={color} strokeWidth={isFocused ? 2.5 : 2} />
                </Pressable>
              );
            }

            return null;
          })}
        </View>
      </View>

      {/* Center Scan Button */}
      <View className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ marginBottom: insets.bottom + 18 }}>
        <Pressable onPress={handleScanPress}>
          <View
            className="w-[72px] h-[72px] rounded-full items-center justify-center overflow-hidden"
            style={styles.scanButton}
          >
            <LinearGradient
              colors={['#0D9488', '#0F766E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Scan size={32} color="#FFFFFF" strokeWidth={2} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scanButton: {
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default function TabLayout() {
  const { isTabBarVisible } = useTabBar();

  return (
    <Tabs
      tabBar={(props) => (isTabBarVisible ? <CustomTabBar {...props} /> : null)}
      screenOptions={{
        sceneStyle: { backgroundColor: '#FFFFFF' },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home/index" />
      <Tabs.Screen
        name="scan/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen name="settings/index" />
    </Tabs>
  );
}
