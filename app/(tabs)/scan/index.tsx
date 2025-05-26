import { View } from 'react-native';
import { ScanScreen } from '@/components/screens/scan';

export default function ScanModal() {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        zIndex: 100,
      }}
    >
      <ScanScreen />
    </View>
  );
}
