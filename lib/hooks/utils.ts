import { toast } from 'sonner-native';

export const handleError = (error: unknown, defaultMessage: string) => {
  if (error instanceof Error) {
    console.error(error);
    toast.error(error.message);
  } else {
    toast.error(defaultMessage);
  }
};
