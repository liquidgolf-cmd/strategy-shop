import type { StrategistResponse, Message, Topic } from '../types';
import { STRATEGIST_SYSTEM_PROMPT } from '../utils/strategistPersonality';
import { userProfileService } from './userProfileService';

export async function sendMessageToStrategist(
  messages: Message[],
  topic: Topic,
  imageData?: string
): Promise<StrategistResponse> {
  try {
    // Get user profile for context
    const userProfile = await userProfileService.getUserProfile();
    
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        topic,
        imageData,
        systemPrompt: STRATEGIST_SYSTEM_PROMPT(topic, userProfile),
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as StrategistResponse;
  } catch (error) {
    console.error('Failed to get response from Strategist:', error);
    throw error;
  }
}

// Keep legacy function for backward compatibility during migration
export async function sendMessageToDad(
  messages: Message[],
  topic: Topic,
  imageData?: string
): Promise<StrategistResponse> {
  return sendMessageToStrategist(messages, topic, imageData);
}
