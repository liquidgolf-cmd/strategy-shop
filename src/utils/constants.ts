import type { TopicConfig, Topic } from '../types';

export const TOPICS: TopicConfig[] = [
  {
    id: 'pricing-revenue',
    title: "Pricing & Revenue",
    emoji: "💰",
    description: "Should I raise prices? Am I leaving money on the table?",
    environment: "strategy-room",
    strategistPosition: 'left',
  },
  {
    id: 'growth-marketing',
    title: "Growth & Marketing",
    emoji: "📈",
    description: "Where should I focus? Should I niche down or stay broad?",
    environment: "strategy-room",
    strategistPosition: 'right',
  },
  {
    id: 'team-hiring',
    title: "Team & Hiring",
    emoji: "👥",
    description: "When should I hire? How do I structure my team?",
    environment: "strategy-room",
    strategistPosition: 'left',
  },
  {
    id: 'strategy-direction',
    title: "Strategy & Direction",
    emoji: "🎯",
    description: "Should I pivot or persevere? What's my 90-day focus?",
    environment: "strategy-room",
    strategistPosition: 'right',
  },
  {
    id: 'operations-systems',
    title: "Operations & Systems",
    emoji: "⚡",
    description: "How do I scale without burning out? What systems do I need?",
    environment: "strategy-room",
    strategistPosition: 'left',
  },
  {
    id: 'general-business',
    title: "General Business",
    emoji: "💼",
    description: "Everything else - unique situations and challenges",
    environment: "strategy-room",
    strategistPosition: 'left',
  },
];

export const TOPIC_CONTEXT: Record<Topic, string> = {
  'pricing-revenue': 'Strategic pricing decisions that impact your bottom line',
  'growth-marketing': 'Focused growth strategies for sustainable scaling',
  'team-hiring': 'Building and managing the right team for your stage',
  'strategy-direction': 'Big picture decisions and strategic clarity',
  'operations-systems': 'Systems and processes that enable growth',
  'general-business': 'All other business challenges and decisions',
};

// Conversation limits for freemium model
export const FREE_CONVERSATION_LIMIT = 3;
export const EMAIL_CAPTURE_BONUS_CONVERSATIONS = 2;
export const TOTAL_FREE_CONVERSATIONS = FREE_CONVERSATION_LIMIT + EMAIL_CAPTURE_BONUS_CONVERSATIONS;
