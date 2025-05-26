import { View, Pressable, Image, Linking } from 'react-native';
import { Text } from '@/components/ui/text';
import { UserRound, Settings2, FileText, Shield, UserMinus, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ConfirmationModal } from '@/components/ui';
import PageLayout from '@/components/layouts/page-layout';

export default function SettingsScreen() {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    // TODO: Implement logout
    router.push('/auth');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement delete account
    setShowDeleteModal(false);
  };

  return (
    <>
      <PageLayout title="Settings" image={require('@/assets/images/avatar.png')}>
        <Pressable className="bg-white mx-4 rounded-2xl shadow mb-4 overflow-hidden">
          <Image
            source={require('@/assets/images/avatar.png')}
            className="w-full h-40"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30" />
          <View className="absolute inset-0 p-4">
            <Text className="text-2xl font-semibold text-white mb-2">
              The journey{'\n'}is easier together
            </Text>
            <View className="bg-white rounded-full px-4 py-2 self-start">
              <Text className="font-medium">Earn $5 for each friend referred</Text>
            </View>
          </View>
        </Pressable>

        {/* Settings List */}
        <View className="bg-white mx-4 rounded-2xl shadow">
          <SettingsItem
            icon={UserRound}
            label="Personal details"
            onPress={() => router.push('/settings/personal-details')}
          />
          <SettingsItem
            icon={Settings2}
            label="Adjust hair goals"
            onPress={() => router.push('/settings/adjust-hair-goals')}
          />
        </View>

        <View className="bg-white mx-4 rounded-2xl shadow mt-4">
          <SettingsItem
            icon={FileText}
            label="Terms and Conditions"
            onPress={() => Linking.openURL('https://www.hairdeet.ai/terms')}
          />
          <SettingsItem
            icon={Shield}
            label="Privacy Policy"
            onPress={() => Linking.openURL('https://www.hairdeet.ai/privacy')}
          />
          <SettingsItem
            icon={UserMinus}
            label="Delete Account"
            onPress={() => setShowDeleteModal(true)}
            isLast
          />
        </View>

        {/* Logout */}
        <View className="bg-white mx-4 rounded-2xl shadow mt-4 mb-8">
          <SettingsItem icon={LogOut} label="Logout" isLast onPress={handleLogout} />
        </View>
      </PageLayout>

      <ConfirmationModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete account?"
        message="Are you sure you want to permanently delete your account?"
        destructive
      />
    </>
  );
}

function SettingsItem({
  icon: Icon,
  label,
  isLast,
  onPress,
  textClassName = '',
}: {
  icon: React.ElementType;
  label: string;
  isLast?: boolean;
  onPress?: () => void;
  textClassName?: string;
}) {
  return (
    <Pressable
      className={`flex-row items-center p-4 ${!isLast && 'border-b border-gray-100'}`}
      onPress={onPress}
    >
      <Icon size={20} color="black" />
      <Text className={`text-lg ${textClassName} ml-2`}>{label}</Text>
    </Pressable>
  );
}
