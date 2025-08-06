import { 
  users, 
  type User, 
  type UpsertUser, 
  type UpdateUserProfile 
} from "@shared/schema";

// Storage interface for Replit Auth and Profile Management
export interface IStorage {
  // User operations for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, profile: UpdateUserProfile): Promise<User>;
  
  // Analysis storage
  storeAnalysis(id: string, analysis: any): Promise<void>;
  getAnalysis(id: string): Promise<any | null>;
  
  // Chat history storage
  storeChatSession(sessionId: string, messages: any[]): Promise<void>;
  getChatSession(sessionId: string): Promise<any[] | null>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private analyses: Map<string, any>;
  private chatSessions: Map<string, any[]>;

  constructor() {
    this.users = new Map();
    this.analyses = new Map();
    this.chatSessions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    const user: User = {
      id: userData.id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      phoneNumber: existingUser?.phoneNumber || null,
      isEmailVerified: existingUser?.isEmailVerified || "false",
      isPhoneVerified: existingUser?.isPhoneVerified || "false",
      bio: existingUser?.bio || null,
      jobTitle: existingUser?.jobTitle || null,
      company: existingUser?.company || null,
      location: existingUser?.location || null,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  async updateUserProfile(id: string, profile: UpdateUserProfile): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...existingUser,
      firstName: profile.firstName || existingUser.firstName,
      lastName: profile.lastName || existingUser.lastName,
      phoneNumber: profile.phoneNumber || existingUser.phoneNumber,
      bio: profile.bio || existingUser.bio,
      jobTitle: profile.jobTitle || existingUser.jobTitle,
      company: profile.company || existingUser.company,
      location: profile.location || existingUser.location,
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
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
