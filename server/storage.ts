import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Analysis storage
  storeAnalysis(id: string, analysis: any): Promise<void>;
  getAnalysis(id: string): Promise<any | null>;
  
  // Chat history storage
  storeChatSession(sessionId: string, messages: any[]): Promise<void>;
  getChatSession(sessionId: string): Promise<any[] | null>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private analyses: Map<string, any>;
  private chatSessions: Map<string, any[]>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.analyses = new Map();
    this.chatSessions = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async storeAnalysis(id: string, analysis: any): Promise<void> {
    this.analyses.set(id, analysis);
  }

  async getAnalysis(id: string): Promise<any | null> {
    return this.analyses.get(id) || null;
  }

  async storeChatSession(sessionId: string, messages: any[]): Promise<void> {
    this.chatSessions.set(sessionId, messages);
  }

  async getChatSession(sessionId: string): Promise<any[] | null> {
    return this.chatSessions.get(sessionId) || null;
  }
}

export const storage = new MemStorage();
