import React from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
  headerStyle?: 'default' | 'transparent' | 'glass';
}

export function PageLayout({
  children,
  title,
  showBackButton = false,
  rightAction,
  headerStyle = 'default',
}: PageLayoutProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const renderHeader = () => {
    if (!title && !showBackButton && !rightAction) return null;

    return (
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            {showBackButton && (
              <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ChevronLeft size={28} color="#0D0D0D" strokeWidth={2} />
              </Pressable>
            )}
            {title && !showBackButton && (
              typeof title === 'string'
                ? <Text style={styles.headerTitle}>{title}</Text>
                : title
            )}
          </View>
          <View style={styles.headerCenter}>
            {title && showBackButton && (
              typeof title === 'string'
                ? <Text style={styles.headerTitle}>{title}</Text>
                : title
            )}
          </View>
          <View style={styles.headerRight}>{rightAction}</View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <View style={[styles.content]}>{children}</View>
    </View>
  );
}

interface GlassCardProps {
  children: React.ReactNode;
  style?: object;
  className?: string;
}

export function GlassCard({ children, style }: GlassCardProps) {
  return (
    <View style={[styles.glassCard, style]}>
      <View style={styles.glassCardContent}>{children}</View>
    </View>
  );
}

interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  headerLeft: {
    minWidth: 44,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    minWidth: 44,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0D0D0D',
    letterSpacing: -0.3,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  content: {
    flex: 1,
  },
  glassCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
    position: 'relative',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  glassCardContent: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D0D0D',
    letterSpacing: -0.2,
  },
});

export default PageLayout;
