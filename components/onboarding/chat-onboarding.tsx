import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { chatQuestions } from '@/constants/chat-questions';
import { AIChatInterface } from '@/components/ui/ai-chat-interface';
import {
  ChatResponse,
  ChatOnboardingState,
  OnboardingData,
} from '@/types/onboarding';
import { OnboardingStorage } from '@/lib/utils/onboarding-storage';
import { getValidationError } from '@/lib/utils/onboarding-validators';
import { updateOnboardingData } from '@/lib/utils/onboarding-data-mapper';

interface ChatOnboardingProps {
  selectedPlan: 'yearly' | 'monthly';
  visible: boolean;
  onClose: () => void;
}

export function ChatOnboarding({ selectedPlan, visible, onClose }: ChatOnboardingProps) {
  const [state, setState] = useState<ChatOnboardingState>({
    currentQuestionIndex: 0,
    responses: [],
    isComplete: false,
    data: { plan: selectedPlan },
  });
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localVisible, setLocalVisible] = useState(visible);

  const currentQuestion = chatQuestions[state.currentQuestionIndex];

  useEffect(() => {
    if (visible) {
      loadStoredData();
    }
  }, [visible]);

  // Sync local visible state with parent prop
  useEffect(() => {
    setLocalVisible(visible);
  }, [visible]);

  async function loadStoredData() {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const [storedData, chatProgress] = await Promise.all([
        OnboardingStorage.load(),
        OnboardingStorage.loadChatProgress()
      ]);
      
      const newState: ChatOnboardingState = {
        currentQuestionIndex: chatProgress?.currentQuestionIndex || 0,
        responses: chatProgress?.responses || [],
        isComplete: chatProgress?.isComplete || false,
        data: storedData ? { ...storedData, plan: selectedPlan } : { plan: selectedPlan },
      };
      
      setState(newState);
      
      // Restore chat messages if they exist
      if (chatProgress && 'messages' in chatProgress) {
        setChatMessages((chatProgress as any).messages || []);
      }
    } catch (error) {
      console.error('Failed to load stored data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function getIntroMessages(): string[] {
    // If we have saved chat messages, don't show intro (let messages display normally)
    if (chatMessages.length > 0) {
      return [];
    }
    
    // Show intro for completely new users (first question)
    if (state.currentQuestionIndex === 0 && state.responses.length === 0) {
      const firstQuestion = chatQuestions[0];
      let message = firstQuestion.message;
      
      // Replace placeholders
      if (message.includes('{name}') && state.data.name) {
        message = message.replace('{name}', state.data.name);
      }
      
      return [message];
    }
    
    // Show question when navigating back/forward (when chat messages are cleared)
    if (currentQuestion) {
      let message = currentQuestion.message;
      
      // Replace placeholders
      if (message.includes('{name}') && state.data.name) {
        message = message.replace('{name}', state.data.name);
      }
      
      return [message];
    }
    
    return [];
  }

  function getQuickActions() {
    if (!currentQuestion?.options) return [];
    
    return currentQuestion.options.map(option => ({
      id: option.value,
      text: option.label,
      emoji: '', // Extract emoji from label if needed
    }));
  }



  async function handleSendMessage(message: string): Promise<string> {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return "Please provide an answer.";

    try {
      // Validate the response
      const validationError = getValidationError(trimmedMessage, currentQuestion, state.data);
      if (validationError) return validationError;

      // No special handling needed - removed risky backend call

      // Save response and get next question
      const nextIndex = await saveResponse(trimmedMessage);

      // Check if we've reached the last question (complete)  
      if (nextIndex >= chatQuestions.length) {
        // This means all questions are answered, the complete question should show
        return "🎉 Perfect! Let's get you set up with your account.";
      }
        
      const nextQuestion = chatQuestions[nextIndex];
      if (!nextQuestion) {
        return "Something went wrong. Please try again.";
      }

      // Build response
      let response = '';
      
      // Add acknowledgment
      if (currentQuestion.followUp) {
        let followUp: string;
        
        if (typeof currentQuestion.followUp === 'object') {
          const matchingOption = currentQuestion.options?.find(opt => 
            trimmedMessage.toLowerCase().includes(opt.label.toLowerCase()) ||
            trimmedMessage.toLowerCase().includes(opt.value.toLowerCase())
          );
          followUp = currentQuestion.followUp[matchingOption?.value || 'default'] || "Got it! ";
        } else {
          followUp = currentQuestion.followUp;
        }
        
        response = followUp.replace('{answer}', trimmedMessage) + '\n\n';
      } else {
        response = (currentQuestion.type === 'select' ? "Got it! " : "Thanks! ");
      }
      
      // Add next question
      response += nextQuestion.message.replace('{name}', state.data.name || 'there');
      
      return response;
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      return "I'm having trouble processing that. Could you try again?";
    }
  }

  async function saveResponse(answer: string): Promise<number> {
    try {
      const response: ChatResponse = {
        questionId: currentQuestion.id,
        answer,
        timestamp: Date.now(),
      };

      const newResponses = [...state.responses.filter(r => r.questionId !== currentQuestion.id), response];
      const newData = updateOnboardingData(state.data, currentQuestion.id, answer, currentQuestion.options);

      let nextIndex = state.currentQuestionIndex + 1;
      
      // Skip logic for specific questions
      if (currentQuestion.id === 'cycle-start' && answer.includes('dont-know')) {
        nextIndex = Math.min(nextIndex + 1, chatQuestions.length);
      }
      if (currentQuestion.id === 'body-goal-weight' && answer.includes('strong')) {
        nextIndex = Math.min(nextIndex + 1, chatQuestions.length);
      }
      
      const newState = {
        ...state,
        responses: newResponses,
        data: newData,
        currentQuestionIndex: nextIndex >= chatQuestions.length ? chatQuestions.length - 1 : nextIndex,
        isComplete: nextIndex >= chatQuestions.length,
      };

      setState(newState);
      
      // Save to storage in background
      Promise.all([
        OnboardingStorage.save(newData as OnboardingData),
        OnboardingStorage.saveChatProgress(newState, chatMessages)
      ]).catch(error => console.error('Failed to save data:', error));

      return nextIndex;
    } catch (error) {
      console.error('Error in saveResponse:', error);
      return state.currentQuestionIndex;
    }
  }


  function handleGoBack() {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
      
      // Clear chat messages when navigating back so the question becomes interactive again
      setChatMessages([]);
    }
  }

  function handleGoForward() {
    // Find the maximum question index that has been answered
    const maxAnsweredIndex = Math.max(...state.responses.map(r => 
      chatQuestions.findIndex(q => q.id === r.questionId)
    ));
    
    const nextIndex = state.currentQuestionIndex + 1;
    
    // Only allow forward if we've already answered that question or it's the next sequential question
    if (nextIndex <= maxAnsweredIndex + 1 && nextIndex < chatQuestions.length) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex
      }));
      
      // Clear chat messages when navigating forward so the question becomes interactive again
      setChatMessages([]);
    }
  }

  function canGoForward(): boolean {
    // If no responses yet, can't go forward
    if (state.responses.length === 0) return false;
    
    const maxAnsweredIndex = Math.max(...state.responses.map(r => 
      chatQuestions.findIndex(q => q.id === r.questionId)
    ));
    
    const nextIndex = state.currentQuestionIndex + 1;
    
    // Can go forward if:
    // 1. The next question has already been answered, OR
    // 2. We're at the last answered question and there's a next question available
    return nextIndex <= maxAnsweredIndex || 
           (state.currentQuestionIndex === maxAnsweredIndex && nextIndex < chatQuestions.length);
  }


  function handleCompleteAccount() {
    // Clear chat progress when completing account
    OnboardingStorage.clearChatProgress().catch(console.error);
    
    // Close modal locally first
    setLocalVisible(false);
    
    // Navigate to signup after modal closes
    setTimeout(() => {
      router.push(`/auth?mode=signup&plan=${state.data.plan}`);
    }, 300); // Wait for modal animation
  }

  function handleMessagesChange(messages: any[]) {
    // Only update if messages actually changed to prevent loops
    if (messages.length !== chatMessages.length || 
        JSON.stringify(messages) !== JSON.stringify(chatMessages)) {
      setChatMessages(messages);
      
      // Save messages to storage immediately
      OnboardingStorage.saveChatProgress(state, messages).catch(error => 
        console.error('Failed to save messages:', error)
      );
    }
  }

  if (isLoading || !currentQuestion) {
    return null;
  }


  return (
    <AIChatInterface
      visible={localVisible}
      onClose={onClose}
      context="onboarding"
      title="🌙 Luna"
      introMessages={getIntroMessages()}
      quickActions={getQuickActions()}
      placeholder={currentQuestion.placeholder || "Type your answer here..."}
      questionId={currentQuestion.id}
      questionType={currentQuestion.type}
      canGoBack={state.currentQuestionIndex > 0}
      canGoForward={canGoForward()}
      onGoBack={handleGoBack}
      onGoForward={handleGoForward}
      onSendMessage={handleSendMessage}
      onCompleteAccount={handleCompleteAccount}
      initialMessages={chatMessages}
      onMessagesChange={handleMessagesChange}
    />
  );
}