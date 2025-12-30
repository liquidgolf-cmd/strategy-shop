import { openDB, type IDBPDatabase } from 'idb';
import type { ConversationSession } from '../types';

const DB_NAME = 'dad-advice-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<any> | null = null;

async function getDB(): Promise<IDBPDatabase<any>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<any>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create sessions store
      const sessionStore = db.createObjectStore('sessions', {
        keyPath: 'startTime',
      });
      sessionStore.createIndex('by-topic', 'topic');

      // Create media store
      db.createObjectStore('media', {
        keyPath: 'id',
      });
    },
  });

  return dbInstance;
}

export const storageService = {
  // Session operations
  async saveSession(session: ConversationSession): Promise<void> {
    const db = await getDB();
    await db.put('sessions', session);
  },

  async getSession(startTime: number): Promise<ConversationSession | undefined> {
    const db = await getDB();
    return await db.get('sessions', String(startTime));
  },

  async getCurrentSession(): Promise<ConversationSession | null> {
    const db = await getDB();
    const sessions = await db.getAll('sessions');
    if (sessions.length === 0) return null;
    
    // Return most recent session
    return sessions.sort((a, b) => b.lastActivity - a.lastActivity)[0];
  },

  async getAllSessions(): Promise<ConversationSession[]> {
    const db = await getDB();
    const sessions = await db.getAll('sessions');
    // Return sessions sorted by most recent activity first
    return sessions.sort((a, b) => b.lastActivity - a.lastActivity);
  },

  async clearOldSessions(maxAge: number = 24 * 60 * 60 * 1000): Promise<void> {
    const db = await getDB();
    const sessions = await db.getAll('sessions');
    const now = Date.now();

    for (const session of sessions) {
      if (now - session.lastActivity > maxAge) {
        await db.delete('sessions', String(session.startTime));
      }
    }
  },

  // Media operations
  async saveMedia(id: string, data: string, type: 'image' | 'video'): Promise<void> {
    const db = await getDB();
    await db.put('media', {
      id,
      data,
      type,
      timestamp: Date.now(),
    });
  },

  async getMedia(id: string): Promise<string | undefined> {
    const db = await getDB();
    const media = await db.get('media', id);
    return media?.data;
  },

  async clearOldMedia(maxAge: number = 60 * 60 * 1000): Promise<void> {
    const db = await getDB();
    const allMedia = await db.getAll('media');
    const now = Date.now();

    for (const media of allMedia) {
      if (now - media.timestamp > maxAge) {
        await db.delete('media', media.id);
      }
    }
  },

  async clearAllData(): Promise<void> {
    const db = await getDB();
    await db.clear('sessions');
    await db.clear('media');
  },
};

// Auto-cleanup on load
storageService.clearOldSessions();
storageService.clearOldMedia();

