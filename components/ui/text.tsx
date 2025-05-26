import { Text as RNText, type TextProps } from 'react-native';
import { cn } from '@/lib/utils/cn';

interface CustomTextProps extends TextProps {
  variant?: 'heading' | 'body' | 'button';
  bold?: boolean;
}

export function Text({ variant = 'body', bold, style, className, ...props }: CustomTextProps) {
  return (
    <RNText 
      className={cn(
        'text-base', // base style
        variant === 'heading' && 'text-3xl font-bold text-center',
        variant === 'button' && 'text-base text-center',
        bold && 'font-bold',
        className
      )}
      style={style}
      {...props} 
    />
  );
} 