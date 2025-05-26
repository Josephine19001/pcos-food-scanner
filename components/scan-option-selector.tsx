import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Camera, Barcode, Image } from 'lucide-react-native';
import clsx from 'clsx';

type ScanOption = 'product' | 'barcode' | 'gallery';

type Option = {
  value: ScanOption;
  label: string;
  Icon: React.ElementType;
};

type Props = {
  selected: ScanOption;
  onSelect: (option: ScanOption) => void;
  options?: { value: ScanOption; label: string }[];
};

const DEFAULT_OPTIONS: Option[] = [
  { value: 'product', label: 'Product', Icon: Camera },
  { value: 'barcode', label: 'Barcode', Icon: Barcode },
  { value: 'gallery', label: 'Gallery', Icon: Image },
];

export function ScanOptionSelector({ selected, onSelect, options }: Props) {
  const icons = DEFAULT_OPTIONS.reduce(
    (acc, opt) => {
      acc[opt.value] = opt.Icon;
      return acc;
    },
    {} as Record<ScanOption, React.ElementType>
  );

  return (
    <View className="flex-row justify-around w-full px-4">
      {(options ?? DEFAULT_OPTIONS).map(({ value, label }) => {
        const Icon = icons[value];
        const isActive = selected === value;

        return (
          <Pressable
            key={value}
            onPress={() => onSelect(value)}
            className={clsx(
              'flex-1 items-center mx-1 py-3 rounded-xl',
              isActive ? 'bg-white' : 'bg-white/10'
            )}
          >
            <Icon size={24} color={isActive ? 'black' : '#d1d5db'} />
            <Text
              className={clsx(
                'text-xs mt-1',
                isActive ? 'text-black font-medium' : 'text-gray-400'
              )}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
