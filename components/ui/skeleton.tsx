import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withRepeat(
      withSequence(
        withTiming('rgb(229, 231, 235)', { duration: 1000 }),
        withTiming('rgb(209, 213, 219)', { duration: 1000 })
      ),
      -1,
      true
    ),
  }));

  return <Animated.View style={[animatedStyle]} className={cn('rounded-xl', className)} />;
}
