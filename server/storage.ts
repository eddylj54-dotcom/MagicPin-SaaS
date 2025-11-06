// Referenced from javascript_database and javascript_log_in_with_replit blueprints
import {
  users,
  connectedAccounts,
  posts,
  templates,
  analytics,
  type User,
  type UpsertUser,
  type ConnectedAccount,
  type InsertConnectedAccount,
  type Post,
  type InsertPost,
  type Template,
  type InsertTemplate,
  type Analytics as AnalyticsType,
  type InsertAnalytics,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Connected accounts operations
  getConnectedAccounts(userId: string): Promise<ConnectedAccount[]>;
  getConnectedAccount(id: string): Promise<ConnectedAccount | undefined>;
  createConnectedAccount(account: InsertConnectedAccount): Promise<ConnectedAccount>;
  updateConnectedAccount(id: string, updates: Partial<ConnectedAccount>): Promise<ConnectedAccount | undefined>;
  deleteConnectedAccount(id: string): Promise<void>;
  
  // Posts operations
  getPosts(userId: string): Promise<Post[]>;
  getRecentPosts(userId: string, limit?: number): Promise<Post[]>;
  getPost(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, updates: Partial<Post>): Promise<Post | undefined>;
  deletePost(id: string): Promise<void>;
  
  // Templates operations
  getTemplates(userId?: string): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, updates: Partial<Template>): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<void>;
  incrementTemplateUsage(id: string): Promise<void>;
  
  // Analytics operations
  getAnalytics(userId: string): Promise<AnalyticsType[]>;
  createAnalytics(data: InsertAnalytics): Promise<AnalyticsType>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Connected accounts operations
  async getConnectedAccounts(userId: string): Promise<ConnectedAccount[]> {
    return await db.select().from(connectedAccounts).where(eq(connectedAccounts.userId, userId));
  }

  async getConnectedAccount(id: string): Promise<ConnectedAccount | undefined> {
    const [account] = await db.select().from(connectedAccounts).where(eq(connectedAccounts.id, id));
    return account;
  }

  async createConnectedAccount(account: InsertConnectedAccount): Promise<ConnectedAccount> {
    const [newAccount] = await db.insert(connectedAccounts).values(account).returning();
    return newAccount;
  }

  async updateConnectedAccount(id: string, updates: Partial<ConnectedAccount>): Promise<ConnectedAccount | undefined> {
    const [updated] = await db
      .update(connectedAccounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(connectedAccounts.id, id))
      .returning();
    return updated;
  }

  async deleteConnectedAccount(id: string): Promise<void> {
    await db.delete(connectedAccounts).where(eq(connectedAccounts.id, id));
  }

  // Posts operations
  async getPosts(userId: string): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.userId, userId)).orderBy(desc(posts.createdAt));
  }

  async getRecentPosts(userId: string, limit: number = 10): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  }

  async getPost(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post | undefined> {
    const [updated] = await db
      .update(posts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return updated;
  }

  async deletePost(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  // Templates operations
  async getTemplates(userId?: string): Promise<Template[]> {
    if (userId) {
      return await db
        .select()
        .from(templates)
        .where(eq(templates.userId, userId))
        .orderBy(desc(templates.usageCount));
    }
    return await db
      .select()
      .from(templates)
      .where(eq(templates.isPublic, true))
      .orderBy(desc(templates.usageCount));
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [newTemplate] = await db.insert(templates).values(template).returning();
    return newTemplate;
  }

  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template | undefined> {
    const [updated] = await db
      .update(templates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(templates.id, id))
      .returning();
    return updated;
  }

  async deleteTemplate(id: string): Promise<void> {
    await db.delete(templates).where(eq(templates.id, id));
  }

  async incrementTemplateUsage(id: string): Promise<void> {
    const template = await this.getTemplate(id);
    if (template) {
      await db
        .update(templates)
        .set({ usageCount: (template.usageCount || 0) + 1 })
        .where(eq(templates.id, id));
    }
  }

  // Analytics operations
  async getAnalytics(userId: string): Promise<AnalyticsType[]> {
    return await db.select().from(analytics).where(eq(analytics.userId, userId)).orderBy(desc(analytics.recordedAt));
  }

  async createAnalytics(data: InsertAnalytics): Promise<AnalyticsType> {
    const [newData] = await db.insert(analytics).values(data).returning();
    return newData;
  }
}

export const storage = new DatabaseStorage();
