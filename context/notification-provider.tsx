import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './auth-provider';

// Configure how notifications are handled when app is in foreground
// We disable the banner since we show our own in-app toast notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: false,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  registerForPushNotifications: () => Promise<string | null>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  // Register for push notifications when user logs in
  useEffect(() => {
    if (user) {
      registerForPushNotifications();
    }
  }, [user]);

  // Set up notification listeners
  useEffect(() => {
    // Listen for incoming notifications while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    // Listen for user interactions with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      // Handle notification tap - navigate to scan detail if scanId present
      if (data?.scanId && data?.type === 'scan_complete') {
        // Use expo-router to navigate
        const { router } = require('expo-router');
        router.push(`/scan/${data.scanId}`);
      }
    });

    return () => {
      // Use .remove() method on subscription objects
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const registerForPushNotifications = async (): Promise<string | null> => {
    // Push notifications only work on physical devices
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device');
      return null;
    }

    try {
      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not already granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Push notification permission not granted');
        return null;
      }

      // Get the Expo push token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      const token = tokenData.data;

      setExpoPushToken(token);

      // Save token to database if user is logged in
      if (user) {
        await savePushToken(token);
      }

      // Configure Android notification channels
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('scan-results', {
          name: 'Scan Results',
          description: 'Notifications when food scan analysis is complete',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#10B981',
        });

        await Notifications.setNotificationChannelAsync('payment-reminders', {
          name: 'Payment Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#10B981',
        });
      }

      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  };

  const savePushToken = async (token: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('accounts')
        .update({ push_token: token })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving push token:', error);
      }
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  };

  const value = {
    expoPushToken,
    notification,
    registerForPushNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider');
  return ctx;
}
