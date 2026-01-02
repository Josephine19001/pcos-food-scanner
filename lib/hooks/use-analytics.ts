import { useCallback } from 'react';
import { usePostHog } from 'posthog-react-native';
import { useAuth } from '@/context/auth-provider';
import { useRevenueCat } from '@/context/revenuecat-provider';
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import i18n from '@/lib/i18n';

// Event names as constants for type safety
export const ANALYTICS_EVENTS = {
  // Auth events
  AUTH_SIGNIN_APPLE_INITIATED: 'auth_signin_apple_initiated',
  AUTH_SIGNIN_APPLE_SUCCESS: 'auth_signin_apple_success',
  AUTH_SIGNIN_APPLE_FAILED: 'auth_signin_apple_failed',
  AUTH_SIGNOUT: 'auth_signout',
  AUTH_DELETE_ACCOUNT_INITIATED: 'auth_delete_account_initiated',
  AUTH_DELETE_ACCOUNT_CONFIRMED: 'auth_delete_account_confirmed',

  // Onboarding events
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  ONBOARDING_STEP_BACK: 'onboarding_step_back',
  ONBOARDING_COMPLETED: 'onboarding_completed',

  // Home events
  HOME_SCREEN_VIEWED: 'home_screen_viewed',
  HOME_TAB_SWITCHED: 'home_tab_switched',
  HOME_SEARCH_USED: 'home_search_used',
  HOME_SCAN_CARD_TAPPED: 'home_scan_card_tapped',
  HOME_SCAN_FAVORITE_TOGGLED: 'home_scan_favorite_toggled',
  HOME_SCAN_DELETED: 'home_scan_deleted',
  HOME_FREE_SCANS_BANNER_CLICKED: 'home_free_scans_banner_clicked',

  // Scan events
  SCAN_SCREEN_OPENED: 'scan_screen_opened',
  SCAN_PERMISSION_DENIED: 'scan_permission_denied',
  SCAN_PHOTO_CAPTURED: 'scan_photo_captured',
  SCAN_IMAGE_PICKED: 'scan_image_picked',
  SCAN_FREE_LIMIT_REACHED: 'scan_free_limit_reached',
  SCAN_PROCESSING_STARTED: 'scan_processing_started',
  SCAN_RESULT_SUCCESS: 'scan_result_success',
  SCAN_RESULT_FAILED: 'scan_result_failed',
  SCAN_RESULT_VIEWED: 'scan_result_viewed',

  // Paywall events
  PAYWALL_VIEWED: 'paywall_viewed',
  PAYWALL_PLAN_SELECTED: 'paywall_plan_selected',
  PAYWALL_SUBSCRIBE_INITIATED: 'paywall_subscribe_initiated',
  PAYWALL_SUBSCRIBE_SUCCESS: 'paywall_subscribe_success',
  PAYWALL_SUBSCRIBE_FAILED: 'paywall_subscribe_failed',
  PAYWALL_CONTINUE_FREE: 'paywall_continue_free',
  PAYWALL_RESTORE_CLICKED: 'paywall_restore_clicked',
  PAYWALL_RESTORE_SUCCESS: 'paywall_restore_success',

  // Journal events
  JOURNAL_SCREEN_VIEWED: 'journal_screen_viewed',
  JOURNAL_PREMIUM_GATE_VIEWED: 'journal_premium_gate_viewed',
  JOURNAL_PREMIUM_UNLOCK_CLICKED: 'journal_premium_unlock_clicked',
  JOURNAL_DATE_SELECTED: 'journal_date_selected',
  JOURNAL_ADD_ENTRY_CLICKED: 'journal_add_entry_clicked',
  JOURNAL_ENTRY_SUBMITTED: 'journal_entry_submitted',

  // Settings events
  SETTINGS_SCREEN_VIEWED: 'settings_screen_viewed',
  SETTINGS_PROFILE_CLICKED: 'settings_profile_clicked',
  SETTINGS_FEEDBACK_CLICKED: 'settings_feedback_clicked',
  SETTINGS_RATE_APP_CLICKED: 'settings_rate_app_clicked',
  SETTINGS_SHARE_APP_CLICKED: 'settings_share_app_clicked',
  SETTINGS_LANGUAGE_CHANGED: 'settings_language_changed',
  SETTINGS_SIGNOUT_CLICKED: 'settings_signout_clicked',
  SETTINGS_DELETE_ACCOUNT_CLICKED: 'settings_delete_account_clicked',

  // Tab navigation
  TAB_SWITCHED: 'tab_switched',

  // App lifecycle
  APP_OPENED: 'app_opened',

  // Referral
  REFERRAL_SCREEN_VIEWED: 'referral_screen_viewed',
  REFERRAL_CODE_COPIED: 'referral_code_copied',
  REFERRAL_SHARE_INITIATED: 'referral_share_initiated',

  // Feedback
  FEEDBACK_SUBMITTED: 'feedback_submitted',
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export function useAnalytics() {
  const posthog = usePostHog();
  const { user } = useAuth();
  const { isSubscribed, freeScansRemaining } = useRevenueCat();

  // Get common properties to include with every event
  const getCommonProperties = useCallback(() => {
    return {
      user_id: user?.id,
      is_subscribed: isSubscribed,
      free_scans_remaining: freeScansRemaining,
      app_version: Application.nativeApplicationVersion,
      platform: Platform.OS,
      locale: i18n.language,
      timestamp: Date.now(),
    };
  }, [user?.id, isSubscribed, freeScansRemaining]);

  // Track an event with common properties
  const track = useCallback(
    (event: AnalyticsEvent, properties?: Record<string, any>) => {
      if (!posthog) {
        console.warn('PostHog not initialized');
        return;
      }

      const eventProperties = {
        ...getCommonProperties(),
        ...properties,
      };

      posthog.capture(event, eventProperties);
    },
    [posthog, getCommonProperties]
  );

  // Identify user (call after sign in)
  const identify = useCallback(
    (userId: string, traits?: Record<string, any>) => {
      if (!posthog) return;

      posthog.identify(userId, {
        ...traits,
        is_subscribed: isSubscribed,
        platform: Platform.OS,
        app_version: Application.nativeApplicationVersion,
      });
    },
    [posthog, isSubscribed]
  );

  // Reset user (call after sign out)
  const reset = useCallback(() => {
    if (!posthog) return;
    posthog.reset();
  }, [posthog]);

  // Screen tracking
  const trackScreen = useCallback(
    (screenName: string, properties?: Record<string, any>) => {
      if (!posthog) return;

      posthog.screen(screenName, {
        ...getCommonProperties(),
        ...properties,
      });
    },
    [posthog, getCommonProperties]
  );

  return {
    track,
    identify,
    reset,
    trackScreen,
    EVENTS: ANALYTICS_EVENTS,
  };
}
