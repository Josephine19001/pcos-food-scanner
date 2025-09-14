/**
 * Validation logic specifically for onboarding questions
 */

import { 
  isSalutation, 
  isValidName, 
  isValidHeight, 
  isValidWeight 
} from './input-validators';
import { isValidMMDDYY } from '@/components/ui/date-input';

export function getValidationError(
  message: string, 
  question: any,
  userData: { name?: string; units?: 'metric' | 'imperial' }
): string | null {
  if (!question) return null;
  
  const trimmed = message.trim();
  if (!trimmed) return "Please provide an answer.";
  
  // Handle salutations kindly first
  if (isSalutation(trimmed)) {
    const currentMessage = question.message.replace('{name}', userData.name || 'there');
    return `Hey there! 👋 I'm doing great, thanks for asking! I'm Luna, and I'm here to get to know you better. ${currentMessage}`;
  }
  
  // For select questions, check if the response matches any option
  if (question.type === 'select' && question.options) {
    const normalizedMessage = trimmed.toLowerCase();
    const matchesOption = question.options.some((option: any) => {
      const normalizedLabel = option.label.toLowerCase();
      const normalizedValue = option.value.toLowerCase();
      
      return normalizedMessage.includes(normalizedLabel) ||
             normalizedMessage.includes(normalizedValue) ||
             normalizedLabel.includes(normalizedMessage) ||
             normalizedValue.includes(normalizedMessage);
    });
    
    if (!matchesOption) {
      const optionsList = question.options.map((opt: any) => `"${opt.label}"`).join(', ');
      const currentMessage = question.message.replace('{name}', userData.name || 'there');
      return `Please choose from: ${optionsList}\n\n${currentMessage}`;
    }
  }
  
  // For date questions, check format with appropriate validation
  if (question.type === 'date') {
    const dateType = question.id === 'birthday' ? 'birthday' : 'period';
    
    if (!isValidMMDDYY(message, dateType)) {
      const currentMessage = question.message.replace('{name}', userData.name || 'there');
      
      if (dateType === 'birthday') {
        return `Please provide a valid birthday in MM/DD/YY format. You must be at least 16 years old to sign up (e.g., 03/15/95). Let me ask again:\n\n${currentMessage}`;
      } else {
        return `Please provide a valid period date in MM/DD/YY format. The date cannot be in the future or more than a year ago (e.g., 01/15/25). Let me ask again:\n\n${currentMessage}`;
      }
    }
  }
  
  // For text questions, specific validation based on question ID
  if (question.type === 'text') {
    const currentMessage = question.message.replace('{name}', userData.name || 'there');
    
    // Name validation
    if (question.id === 'personal') {
      if (!isValidName(message)) {
        return `Please enter a valid name (letters, spaces, hyphens, and apostrophes only, 2-50 characters). ${currentMessage}`;
      }
    }
    
    // Height validation
    if (question.id === 'body-height') {
      const units = (userData.units || 'metric') as 'metric' | 'imperial';
      if (!isValidHeight(message, units)) {
        const example = units === 'metric' ? 
          'like "165 cm" or "1.65 m" (100-250 cm)' : 
          'like "5\'5\"" or "65 inches" (4\'0" to 8\'0")';
        return `Please enter a valid height ${example}. ${currentMessage}`;
      }
    }
    
    // Weight validation
    if (question.id === 'body-weight' || question.id === 'body-goal-weight-input') {
      const units = (userData.units || 'metric') as 'metric' | 'imperial';
      if (!isValidWeight(message, units)) {
        const example = units === 'metric' ? 
          'like "65 kg" (30-300 kg)' : 
          'like "140 lbs" (66-660 lbs)';
        return `Please enter a valid weight ${example}. ${currentMessage}`;
      }
    }
    
    // General text validation
    if (message.length < 2) {
      return `Please provide a more complete answer. ${currentMessage}`;
    }
    
    // Check for obviously off-topic responses (excluding salutations which are handled above)
    const offTopicKeywords = ['weather', 'joke', 'funny', 'sing', 'poem', 'story', 'news', 'sports', 'politics'];
    const lowerMessage = message.toLowerCase();
    const isOffTopic = offTopicKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (isOffTopic) {
      return `Sorry, but Luna is focused on getting to know you well to set up a better experience! 😊 Let's stay on track.\n\n${currentMessage}`;
    }
  }
  
  return null; // Valid response
}