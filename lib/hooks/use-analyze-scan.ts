import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { ProductAnalysisResult } from '@/lib/types/product';

export function useAnalyzeScan() {
  return useMutation<ProductAnalysisResult, Error, { barcode?: string; imageUrl?: string }>({
    mutationFn: async ({ barcode, imageUrl }) => {
      try {
        const { data, error } = await supabase.functions.invoke<ProductAnalysisResult>(
          'ai-scan-api',
          {
            body: { barcode, image_url: imageUrl },
          }
        );

        console.log('Supabase function response:', { data, error });

        if (error) {
          console.error('Supabase function error:', error);

          // Handle different types of errors
          if (error.message?.includes('Edge Function returned a non-2xx status code')) {
            throw new Error(
              'Unable to analyze the product image. Please try again with a clearer photo.'
            );
          } else if (error.message?.includes('Missing auth token')) {
            throw new Error('Authentication error. Please log in again.');
          } else if (error.message?.includes('Missing barcode or image_url')) {
            throw new Error('No image provided for analysis.');
          } else if (error.message?.includes('Service is temporarily busy')) {
            throw new Error('AI service is busy. Please try again in a moment.');
          } else if (error.message?.includes('Unable to identify the product')) {
            throw new Error(
              'Could not identify the product. Please ensure the image shows the product label clearly.'
            );
          } else if (error.message?.includes('Product data is too complex')) {
            throw new Error(
              'Product image is too complex to analyze. Please try with a simpler, clearer photo.'
            );
          } else if (error.message?.includes('Analysis service is temporarily unavailable')) {
            throw new Error('Analysis service is temporarily down. Please try again later.');
          } else if (
            error.message?.includes('Product identification service is temporarily unavailable')
          ) {
            throw new Error(
              'Product identification service is temporarily down. Please try again later.'
            );
          } else {
            throw new Error(
              'Analysis failed. Please check your internet connection and try again.'
            );
          }
        }

        if (!data) {
          throw new Error('No analysis data received. Please try again.');
        }

        return data;
      } catch (err) {
        console.error('Analysis error:', err);

        // Re-throw with user-friendly message if it's already a user-friendly error
        if (
          err instanceof Error &&
          (err.message.includes('Unable to analyze') ||
            err.message.includes('Authentication error') ||
            err.message.includes('No image provided') ||
            err.message.includes('Analysis failed') ||
            err.message.includes('No analysis data') ||
            err.message.includes('AI service is busy') ||
            err.message.includes('Could not identify the product') ||
            err.message.includes('Product image is too complex') ||
            err.message.includes('Analysis service is temporarily') ||
            err.message.includes('Product identification service is temporarily'))
        ) {
          throw err;
        }

        // Handle network errors
        if (
          err instanceof Error &&
          (err.message.includes('fetch') || err.message.includes('network'))
        ) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }

        // Generic fallback error
        throw new Error('Something went wrong during analysis. Please try again.');
      }
    },
  });
}
