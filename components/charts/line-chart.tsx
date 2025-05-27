import { View, Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { format } from 'date-fns';

type LineChartProps = {
  data: number[];
  timeRange: 'daily' | 'weekly' | 'monthly';
  labels: string[]; // dates in ISO string format
};

export function LineChart({ data, timeRange, labels }: LineChartProps) {
  const screenWidth = Dimensions.get('window').width - 32;
  const height = 400;
  const maxValue = Math.ceil(Math.max(...data) + 0.5);
  const minValue = Math.floor(Math.min(...data) - 0.5);
  const range = maxValue - minValue;
  const stepSize = 0.5; // Each grid line represents 0.5 units
  const steps = Math.ceil(range / stepSize);

  const getY = (value: number) => {
    return height - 40 - ((value - minValue) / range) * (height - 80);
  };

  const getX = (index: number) => {
    return 40 + (index / (data.length - 1)) * (screenWidth - 80);
  };

  return (
    <View style={{ height }} className="relative">
      {/* Grid lines and Y-axis labels */}
      {Array.from({ length: steps + 1 }).map((_, i) => {
        const value = maxValue - i * stepSize;
        return (
          <View
            key={i}
            className="absolute left-0 flex-row items-center w-full"
            style={{ top: getY(value) }}
          >
            <Text className="text-gray-400 w-12 text-right pr-2">{value.toFixed(1)}</Text>
            <View className="flex-1 h-[1px] bg-gray-100" />
          </View>
        );
      })}

      {/* Data points and connecting lines */}
      <View className="absolute" style={{ top: 0, left: 0, right: 0, bottom: 40 }}>
        {/* Connecting lines */}
        <View className="absolute" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          {data.map((value, index) => {
            if (index === data.length - 1) return null;
            const nextValue = data[index + 1];
            const x1 = getX(index);
            const y1 = getY(value);
            const x2 = getX(index + 1);
            const y2 = getY(nextValue);

            return (
              <View
                key={index}
                className="absolute bg-gray-300"
                style={{
                  height: 1,
                  width: Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
                  left: x1,
                  top: y1,
                  transform: [
                    {
                      rotate: `${Math.atan2(y2 - y1, x2 - x1)}rad`,
                    },
                  ],
                  transformOrigin: 'left top',
                }}
              />
            );
          })}
        </View>

        {/* Points */}
        {data.map((value, index) => (
          <View
            key={index}
            className="absolute"
            style={{
              left: getX(index) - 6,
              top: getY(value) - 6,
            }}
          >
            <View className="w-3 h-3 rounded-full bg-black" />
            <Text
              className="text-gray-600 text-sm mt-4 text-center"
              style={{ width: 80, marginLeft: -34 }}
            >
              {format(new Date(labels[index]), 'dd/MM/yyyy')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
