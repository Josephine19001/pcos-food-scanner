import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { DEMO_MODE, getDemoScanById, DEMO_IMAGES } from '@/lib/config/demo-data';
import { useScan } from '@/lib/hooks/use-scans';
import type { ScanResult, ScanStatus, ScanAnalysis } from '@/lib/types/scan';

// Icons
function ChevronLeftIcon({ color = '#111827', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m15 18-6-6 6-6" />
    </Svg>
  );
}

function BookmarkIcon({ color = '#111827', size = 24, filled = false }: { color?: string; size?: number; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </Svg>
  );
}

function CheckCircleIcon({ color = '#10B981', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="m9 12 2 2 4-4" />
    </Svg>
  );
}

function AlertTriangleIcon({ color = '#F59E0B', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <Path d="M12 9v4M12 17h.01" />
    </Svg>
  );
}

function XCircleIcon({ color = '#EF4444', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="m15 9-6 6M9 9l6 6" />
    </Svg>
  );
}

// Status configuration
const statusConfig: Record<ScanStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  safe: {
    label: 'PCOS Friendly',
    color: '#059669',
    bgColor: 'rgba(209, 250, 229, 0.8)',
    icon: <CheckCircleIcon color="#059669" />,
  },
  caution: {
    label: 'Consume with Caution',
    color: '#D97706',
    bgColor: 'rgba(254, 243, 199, 0.8)',
    icon: <AlertTriangleIcon color="#D97706" />,
  },
  avoid: {
    label: 'Best to Avoid',
    color: '#DC2626',
    bgColor: 'rgba(254, 226, 226, 0.8)',
    icon: <XCircleIcon color="#DC2626" />,
  },
};

// Analysis label mapping
const analysisLabels: Record<string, string> = {
  glycemic_index: 'Glycemic Index',
  sugar_content: 'Sugar Content',
  inflammatory_score: 'Inflammatory Score',
  hormone_impact: 'Hormone Impact',
  fiber_content: 'Fiber Content',
  protein_quality: 'Protein Quality',
  healthy_fats: 'Healthy Fats',
  processed_level: 'Processing Level',
};

function formatAnalysisValue(key: string, value: any): string {
  if (key === 'inflammatory_score') return `${value}/10`;
  if (key === 'healthy_fats') return value ? 'Yes' : 'No';
  if (typeof value === 'string') return value.charAt(0).toUpperCase() + value.slice(1);
  return String(value);
}

function getAnalysisColor(key: string, value: any): string {
  // Good values
  if (key === 'glycemic_index' && value === 'low') return '#059669';
  if (key === 'sugar_content' && value === 'low') return '#059669';
  if (key === 'inflammatory_score' && value <= 3) return '#059669';
  if (key === 'hormone_impact' && value === 'positive') return '#059669';
  if (key === 'fiber_content' && value === 'high') return '#059669';
  if (key === 'protein_quality' && value === 'high') return '#059669';
  if (key === 'healthy_fats' && value === true) return '#059669';
  if (key === 'processed_level' && value === 'minimally') return '#059669';

  // Moderate values
  if (key === 'glycemic_index' && value === 'medium') return '#D97706';
  if (key === 'sugar_content' && value === 'moderate') return '#D97706';
  if (key === 'inflammatory_score' && value <= 6) return '#D97706';
  if (key === 'hormone_impact' && value === 'neutral') return '#D97706';
  if (key === 'fiber_content' && value === 'moderate') return '#D97706';
  if (key === 'protein_quality' && value === 'moderate') return '#D97706';
  if (key === 'processed_level' && value === 'moderately') return '#D97706';

  // Bad values
  return '#DC2626';
}

interface AnalysisItemProps {
  label: string;
  value: string;
  color: string;
}

function AnalysisItem({ label, value, color }: AnalysisItemProps) {
  return (
    <View style={styles.analysisItem}>
      <Text style={styles.analysisLabel}>{label}</Text>
      <Text style={[styles.analysisValue, { color }]}>{value}</Text>
    </View>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
}

function Section({ title, children, delay = 0 }: SectionProps) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </Animated.View>
  );
}

export default function ScanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Get scan data
  const { data: apiScan, isLoading } = useScan(id || '');
  const demoScan = DEMO_MODE ? getDemoScanById(id || '') : undefined;
  const scan: ScanResult | undefined = DEMO_MODE ? demoScan : apiScan;

  if (!scan && !isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeftIcon />
          </Pressable>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Scan not found</Text>
        </View>
      </View>
    );
  }

  if (!scan) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  const status = statusConfig[scan.status];
  const analysis = scan.analysis;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        {scan.image_url && (
          <Animated.View entering={FadeIn.duration(400)}>
            {scan.image_url.startsWith('local:') ? (
              <Image
                source={DEMO_IMAGES[scan.image_url.replace('local:', '') as keyof typeof DEMO_IMAGES]}
                style={styles.heroImage}
              />
            ) : (
              <Image source={{ uri: scan.image_url }} style={styles.heroImage} />
            )}
            <View style={[styles.headerOverlay, { paddingTop: insets.top }]}>
              <Pressable onPress={() => router.back()} style={styles.headerButton}>
                <ChevronLeftIcon color="#FFFFFF" />
              </Pressable>
              <Pressable style={styles.headerButton}>
                <BookmarkIcon color="#FFFFFF" filled={scan.is_favorite} />
              </Pressable>
            </View>
          </Animated.View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Status Badge */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={[styles.statusBadge, { backgroundColor: status.bgColor }]}
          >
            {status.icon}
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </Animated.View>

          {/* Title */}
          <Animated.Text entering={FadeInDown.delay(150).duration(400)} style={styles.title}>
            {scan.name}
          </Animated.Text>

          {/* Summary */}
          <Animated.Text entering={FadeInDown.delay(200).duration(400)} style={styles.summary}>
            {scan.summary}
          </Animated.Text>

          {/* Analysis Grid */}
          {analysis && (
            <Section title="Nutritional Analysis" delay={250}>
              <View style={styles.analysisGrid}>
                {Object.entries(analysis).map(([key, value]) => {
                  if (key === 'recommendations' || key === 'warnings' || value === undefined) return null;
                  return (
                    <AnalysisItem
                      key={key}
                      label={analysisLabels[key] || key}
                      value={formatAnalysisValue(key, value)}
                      color={getAnalysisColor(key, value)}
                    />
                  );
                })}
              </View>
            </Section>
          )}

          {/* Ingredients */}
          {scan.ingredients && scan.ingredients.length > 0 && (
            <Section title="Ingredients" delay={300}>
              <View style={styles.ingredientsList}>
                {scan.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientTag}>
                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </View>
                ))}
              </View>
            </Section>
          )}

          {/* Recommendations */}
          {analysis?.recommendations && analysis.recommendations.length > 0 && (
            <Section title="Recommendations" delay={350}>
              <View style={styles.listContainer}>
                {analysis.recommendations.map((rec, index) => (
                  <View key={index} style={styles.listItem}>
                    <CheckCircleIcon size={18} />
                    <Text style={styles.listItemText}>{rec}</Text>
                  </View>
                ))}
              </View>
            </Section>
          )}

          {/* Warnings */}
          {analysis?.warnings && analysis.warnings.length > 0 && (
            <Section title="Warnings" delay={400}>
              <View style={styles.listContainer}>
                {analysis.warnings.map((warning, index) => (
                  <View key={index} style={styles.listItem}>
                    <AlertTriangleIcon size={18} />
                    <Text style={styles.listItemText}>{warning}</Text>
                  </View>
                ))}
              </View>
            </Section>
          )}
        </View>
      </ScrollView>

      {/* Header without image */}
      {!scan.image_url && (
        <View style={[styles.headerNoImage, { paddingTop: insets.top }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeftIcon />
          </Pressable>
          <Pressable style={styles.backButton}>
            <BookmarkIcon filled={scan.is_favorite} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#F3F4F6',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerNoImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(243, 244, 246, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6B7280',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  analysisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  analysisItem: {
    width: '47%',
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    borderRadius: 14,
    padding: 14,
  },
  analysisLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  analysisValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientTag: {
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ingredientText: {
    fontSize: 14,
    color: '#374151',
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
