import { View, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Text } from '@/components/ui/text';
import { ScanLine, X } from 'lucide-react-native';

export interface ScanningPerson {
  id: number;
  name: string;
  product: string;
  image: any;
}

interface ScanningPersonCardProps {
  person: ScanningPerson;
}

export function ScanningPersonCard({ person }: ScanningPersonCardProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const player = useVideoPlayer(person.image, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  const modalPlayer = useVideoPlayer(person.image, (player) => {
    player.loop = true;
    player.muted = false;
    player.play();
  });

  return (
    <>
      <View className="mr-4">
        <TouchableOpacity onPress={() => setModalVisible(true)} className="relative">
          {/* Portrait container with rounded corners */}
          <View className="w-32 h-44 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <VideoView
              style={{ width: '100%', height: '100%' }}
              player={player}
              allowsFullscreen={false}
              allowsPictureInPicture={false}
              nativeControls={false}
              contentFit="cover"
            />
            {/* Scanning overlay */}
            <View className="absolute inset-0 bg-black/20 items-center justify-center" />
            {/* Info overlay at bottom */}
            <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <Text className="text-white text-xs font-semibold">{person.name}</Text>
              <Text className="text-white/80 text-xs">{person.product}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal for fullscreen video */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black">
          <SafeAreaView className="flex-1">
            {/* Close button */}
            <View className="absolute top-12 right-4 z-10">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-black/50 rounded-full p-2"
              >
                <X size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Fullscreen video */}
            <View className="flex-1 items-center justify-center px-4">
              <View className="w-full h-4/5 rounded-2xl overflow-hidden">
                <VideoView
                  style={{ width: '100%', height: '100%' }}
                  player={modalPlayer}
                  allowsFullscreen={false}
                  allowsPictureInPicture={false}
                  nativeControls={true}
                  contentFit="contain"
                />
              </View>

              {/* Video info */}
              <View className="p-6 items-center">
                <Text className="text-white text-2xl font-bold mb-2 text-center">
                  {person.name}
                </Text>
                <Text className="text-gray-300 text-lg text-center">Scanning {person.product}</Text>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}
