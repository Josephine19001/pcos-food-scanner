/**
 * Maps user responses to structured onboarding data
 */

import { OnboardingData } from '@/types/onboarding';
import { parseHeight, parseWeight } from './input-parsers';

export function updateOnboardingData(
  currentData: Partial<OnboardingData>,
  questionId: string, 
  answer: string,
  questionOptions?: Array<{ label: string; value: string }>
): Partial<OnboardingData> {
  const newData = { ...currentData };

  // Parse answer based on question type and options
  let parsedAnswer: string | string[] = answer;
  
  // For select questions, try to match against option values
  if (questionOptions) {
    const option = questionOptions.find(opt => 
      opt.label.toLowerCase().includes(answer.toLowerCase()) || 
      opt.value === answer
    );
    if (option) {
      parsedAnswer = option.value;
    }
  }

  switch (questionId) {
    case 'personal':
      newData.name = String(parsedAnswer);
      break;
    case 'birthday':
      newData.dateOfBirth = String(parsedAnswer);
      break;
    case 'cycle-start':
      newData.knowsLastPeriod = parsedAnswer === 'know-date';
      break;
    case 'cycle-start-date':
      newData.lastPeriodStart = String(parsedAnswer);
      break;
    case 'cycle-regularity':
      newData.cycleRegularity = parsedAnswer as 'regular' | 'irregular' | 'unknown';
      break;
    case 'cycle-length':
      // Convert cycle length string to number, default to 28 if unknown
      newData.cycleLength = parsedAnswer === 'unknown' ? 28 : parseInt(String(parsedAnswer));
      break;
    case 'cycle-symptoms':
      newData.cycleSymptoms = Array.isArray(parsedAnswer) ? parsedAnswer : [String(parsedAnswer)];
      break;
    case 'flow-intensity':
      newData.flowIntensity = parsedAnswer as 'light' | 'moderate' | 'heavy' | 'varies';
      break;
    case 'nutrition-style':
      newData.nutritionStyle = parsedAnswer as 'all' | 'plants' | 'vegan' | 'surprise';
      break;
    case 'nutrition-goal':
      newData.nutritionGoal = String(parsedAnswer);
      break;
    case 'nutrition-activity':
      newData.activityLevel = String(parsedAnswer);
      break;
    case 'fitness-goal':
      newData.fitnessGoal = String(parsedAnswer);
      break;
    case 'fitness-frequency':
      newData.fitnessFrequency = String(parsedAnswer);
      break;
    case 'fitness-style':
      newData.fitnessStyles = Array.isArray(parsedAnswer) ? parsedAnswer : [String(parsedAnswer)];
      break;
    case 'fitness-location':
      newData.fitnessLocation = parsedAnswer as 'home' | 'gym' | 'outdoors' | 'none';
      break;
    case 'body-units':
      newData.units = parsedAnswer as 'metric' | 'imperial';
      break;
    case 'body-height':
      // Parse height from string like "165 cm" or "5'5\""
      newData.height = parseHeight(String(parsedAnswer), newData.units || 'metric');
      break;
    case 'body-weight':
      // Parse weight from string like "65 kg" or "140 lbs"
      newData.weight = parseWeight(String(parsedAnswer));
      break;
    case 'body-goal-weight':
      // Store if user wants to set a goal weight
      newData.hasGoalWeight = parsedAnswer === 'has-goal';
      break;
    case 'body-goal-weight-input':
      // Parse goal weight from string
      newData.weightGoal = parseWeight(String(parsedAnswer));
      break;
  }

  return newData;
}

/**
 * Maps questionnaire responses to OnboardingData format
 * Used for the alternative questionnaire-based onboarding flow
 */
export function mapQuestionnaireDataToOnboarding(
  questionnaireData: Record<string, string | string[]>
): Partial<OnboardingData> {
  const onboardingData: Partial<OnboardingData> = {};

  // Process each questionnaire response using the existing mapper logic
  for (const [questionId, answer] of Object.entries(questionnaireData)) {
    if (answer !== null && answer !== undefined && answer !== '') {
      // Convert questionnaire responses to the chat format
      const mappedData = updateOnboardingData(onboardingData, questionId, 
        Array.isArray(answer) ? answer : String(answer)
      );
      Object.assign(onboardingData, mappedData);
    }
  }

  return onboardingData;
}