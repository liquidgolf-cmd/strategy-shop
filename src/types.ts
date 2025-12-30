export type Topic = 
  | 'pricing-revenue'
  | 'growth-marketing'
  | 'team-hiring'
  | 'strategy-direction'
  | 'operations-systems'
  | 'general-business';

export interface TopicConfig {
  id: Topic;
  title: string;
  emoji: string;
  description: string;
  environment: string;
  strategistPosition: 'left' | 'right';
}

export interface Message {
  id: string;
  role: 'user' | 'strategist';
  content: string;
  timestamp: number;
  audioUrl?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  needsProfessional?: boolean;
  professionalType?: string;
  videoSuggestion?: string;
  conversationNumber?: number;
  strategistInsight?: string;
}

export interface StrategistResponse {
  message: string;
  audioText: string;
  needsDeepWork: boolean;
  frameworkSuggested?: string;
  escalationType?: 'clarity_sprint' | 'deep_dive' | 'structured_planning';
  videoSuggestion?: string;
  mood?: StrategistMood;
}

export type StrategistMood = 
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'analyzing'
  | 'explaining'
  | 'concerned'
  | 'encouraging'
  | 'confident'
  | 'surprised'
  | 'challenging';

export interface ConversationSession {
  topic: Topic;
  messages: Message[];
  startTime: number;
  lastActivity: number;
}

export interface UserProfile {
  id: string;
  email?: string;
  businessName?: string;
  businessType?: string;
  revenue?: string;
  teamSize?: string;
  biggestChallenge?: string;
  createdAt: number;
  conversationCount: number;
  hasProvidedEmail: boolean;
  hasCompletedProfile: boolean;
}

export interface ConversationMetadata {
  userId: string;
  conversationCount: number;
  hasCompletedProfile: boolean;
  hasProvidedEmail: boolean;
  lastTopicDiscussed?: Topic;
}
