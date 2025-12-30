import { openDB, type IDBPDatabase } from 'idb';
import type { UserProfile, ConversationMetadata } from '../types';

const DB_NAME = 'strategy-shop-db';
const DB_VERSION = 2; // Increment from dad-advice-app version
const USER_PROFILE_STORE = 'userProfiles';
const METADATA_STORE = 'conversationMetadata';

// Generate a unique user ID (simple implementation for Phase 1)
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create the database
async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create user profiles store if it doesn't exist
      if (!db.objectStoreNames.contains(USER_PROFILE_STORE)) {
        db.createObjectStore(USER_PROFILE_STORE, { keyPath: 'id' });
      }
      
      // Create conversation metadata store
      if (!db.objectStoreNames.contains(METADATA_STORE)) {
        db.createObjectStore(METADATA_STORE, { keyPath: 'userId' });
      }
    },
  });
}

export const userProfileService = {
  /**
   * Get the current user's profile, or create one if it doesn't exist
   */
  async getUserProfile(): Promise<UserProfile> {
    const db = await getDB();
    
    // Check localStorage for user ID first (persistent across sessions)
    let userId = localStorage.getItem('strategyShopUserId');
    
    if (!userId) {
      // New user - generate ID
      userId = generateUserId();
      localStorage.setItem('strategyShopUserId', userId);
    }
    
    // Try to get existing profile
    let profile = await db.get(USER_PROFILE_STORE, userId);
    
    if (!profile) {
      // Create new profile
      profile = {
        id: userId,
        createdAt: Date.now(),
        conversationCount: 0,
        hasProvidedEmail: false,
        hasCompletedProfile: false,
      };
      await db.put(USER_PROFILE_STORE, profile);
    }
    
    return profile;
  },

  /**
   * Increment the conversation counter and return the new count
   */
  async incrementConversationCount(): Promise<number> {
    const profile = await this.getUserProfile();
    profile.conversationCount += 1;
    
    const db = await getDB();
    await db.put(USER_PROFILE_STORE, profile);
    
    return profile.conversationCount;
  },

  /**
   * Get the current conversation count without incrementing
   */
  async getConversationCount(): Promise<number> {
    const profile = await this.getUserProfile();
    return profile.conversationCount;
  },

  /**
   * Save email address (Phase 2 will send to CRM)
   */
  async saveEmail(email: string): Promise<void> {
    const profile = await this.getUserProfile();
    profile.email = email;
    profile.hasProvidedEmail = true;
    
    const db = await getDB();
    await db.put(USER_PROFILE_STORE, profile);
    
    console.log('Email saved to profile:', email);
    // TODO Phase 2: Send to CRM/email service
  },

  /**
   * Update business information
   */
  async updateBusinessInfo(info: Partial<UserProfile>): Promise<void> {
    const profile = await this.getUserProfile();
    
    // Update fields
    if (info.businessName) profile.businessName = info.businessName;
    if (info.businessType) profile.businessType = info.businessType;
    if (info.revenue) profile.revenue = info.revenue;
    if (info.teamSize) profile.teamSize = info.teamSize;
    if (info.biggestChallenge) profile.biggestChallenge = info.biggestChallenge;
    
    // Mark profile as complete if we have key info
    if (profile.businessType && profile.revenue) {
      profile.hasCompletedProfile = true;
    }
    
    const db = await getDB();
    await db.put(USER_PROFILE_STORE, profile);
    
    console.log('Business info updated:', info);
  },

  /**
   * Check if user has hit the free conversation limit
   */
  async hasHitFreeLimit(limit: number): Promise<boolean> {
    const count = await this.getConversationCount();
    return count >= limit;
  },

  /**
   * Reset user profile (for testing)
   */
  async resetProfile(): Promise<void> {
    const userId = localStorage.getItem('strategyShopUserId');
    if (userId) {
      const db = await getDB();
      await db.delete(USER_PROFILE_STORE, userId);
      localStorage.removeItem('strategyShopUserId');
    }
  },

  /**
   * Get conversation metadata
   */
  async getConversationMetadata(): Promise<ConversationMetadata | null> {
    const profile = await this.getUserProfile();
    return {
      userId: profile.id,
      conversationCount: profile.conversationCount,
      hasCompletedProfile: profile.hasCompletedProfile,
      hasProvidedEmail: profile.hasProvidedEmail,
    };
  },
};

