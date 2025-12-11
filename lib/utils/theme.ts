/**
 * Hook to get theme-aware class names
 * Usage: const themed = useThemedStyles(); themed('bg-white', 'dark:bg-gray-900')
 * Note: Dark theme is disabled for now, always returns light theme
 */
export function useThemedStyles() {
  return (lightClass: string, _darkClass: string = '') => {
    return lightClass;
  };
}

/**
 * Get theme-specific color values
 * Note: Dark theme is disabled for now, always returns light theme colors
 */
export function useThemedColors() {
  // Dark theme disabled - always use light theme
  const isDark = false;

  return {
    // Backgrounds
    background: isDark ? '#0F0F0F' : '#FFFFFF',
    backgroundSecondary: isDark ? '#1A1A1A' : '#F9FAFB',
    card: isDark ? '#1A1A1A' : '#F9FAFB',
    cardBorder: isDark ? '#2A2A2A' : '#E5E7EB',

    // Text
    text: isDark ? '#F9FAFB' : '#0D0D0D',
    textSecondary: isDark ? '#9CA3AF' : '#6B7280',
    textMuted: isDark ? '#6B7280' : '#9CA3AF',

    // Borders & Dividers
    border: isDark ? '#374151' : '#E5E7EB',
    borderLight: isDark ? '#2A2A2A' : '#F3F4F6',
    divider: isDark ? '#2A2A2A' : '#E5E7EB',

    // Interactive elements
    iconBackground: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    iconBackgroundActive: 'rgba(16, 185, 129, 0.2)',

    // Danger
    dangerBackground: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
    dangerText: '#EF4444',

    // Modal
    modalBackground: isDark ? '#1A1A1A' : '#FFFFFF',
    modalOverlay: 'rgba(0, 0, 0, 0.5)',

    // Input
    inputBackground: isDark ? '#2A2A2A' : '#F3F4F6',
    inputText: isDark ? '#F9FAFB' : '#0D0D0D',
    inputPlaceholder: '#9CA3AF',

    // Status bar
    statusBarStyle: isDark ? 'light-content' : 'dark-content',
  };
}