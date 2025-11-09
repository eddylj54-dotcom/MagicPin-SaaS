import {
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
  type TimestampString,
  type TimestampInput,
} from "@shared/schema";
import { firestore } from "./firebaseAdmin";
import {
  FieldValue,
  Timestamp,
  type DocumentSnapshot,
  type Query,
} from "firebase-admin/firestore";

const usersCollection = firestore.collection("users");
const connectedAccountsCollection = firestore.collection("connected_accounts");
const postsCollection = firestore.collection("posts");
const templatesCollection = firestore.collection("templates");
const analyticsCollection = firestore.collection("analytics");

const toIsoString = (
  value?: Timestamp | Date | null,
): TimestampString => {
  if (!value) {
    return undefined;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if ("toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  return undefined;
};

const toDateOrUndefined = (value?: TimestampInput) => {
  if (!value) {
    return undefined;
  }
  if (value instanceof Date) {
    return value;
  }
  return new Date(value);
};

const mapUser = (doc: DocumentSnapshot): User => {
  const data = doc.data() || {};
  return {
    id: doc.id,
    email: data.email ?? null,
    firstName: data.firstName ?? null,
    lastName: data.lastName ?? null,
    profileImageUrl: data.profileImageUrl ?? null,
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  };
};

const mapConnectedAccount = (
  doc: DocumentSnapshot,
): ConnectedAccount => {
  const data = doc.data() || {};
  return {
    id: doc.id,
    userId: data.userId,
    platform: data.platform,
    accountName: data.accountName ?? null,
    accountId: data.accountId ?? null,
    followers: data.followers ?? 0,
    isConnected: data.isConnected ?? true,
    accessToken: data.accessToken ?? null,
    refreshToken: data.refreshToken ?? null,
    tokenExpiry: toIsoString(data.tokenExpiry),
    metadata: data.metadata ?? {},
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  };
};

const mapPost = (doc: DocumentSnapshot): Post => {
  const data = doc.data() || {};
  return {
    id: doc.id,
    userId: data.userId,
    content: data.content,
    platforms: data.platforms ?? [],
    mediaUrls: data.mediaUrls ?? [],
    scheduledFor: toIsoString(data.scheduledFor),
    status: data.status ?? "draft",
    publishedAt: toIsoString(data.publishedAt),
    metadata: data.metadata ?? {},
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  };
};

const mapTemplate = (doc: DocumentSnapshot): Template => {
  const data = doc.data() || {};
  return {
    id: doc.id,
    userId: data.userId ?? null,
    name: data.name,
    description: data.description ?? null,
    category: data.category ?? null,
    content: data.content,
    platforms: data.platforms ?? [],
    isPublic: data.isPublic ?? false,
    usageCount: data.usageCount ?? 0,
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  };
};

const mapAnalytics = (doc: DocumentSnapshot): AnalyticsType => {
  const data = doc.data() || {};
  return {
    id: doc.id,
    userId: data.userId,
    postId: data.postId ?? null,
    platform: data.platform,
    likes: data.likes ?? 0,
    shares: data.shares ?? 0,
    comments: data.comments ?? 0,
    reach: data.reach ?? 0,
    engagementRate: data.engagementRate ?? 0,
    recordedAt: toIsoString(data.recordedAt),
  };
};

const addTimestamps = (isNew: boolean) => ({
  updatedAt: FieldValue.serverTimestamp(),
  ...(isNew ? { createdAt: FieldValue.serverTimestamp() } : {}),
});

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  getConnectedAccounts(userId: string): Promise<ConnectedAccount[]>;
  getConnectedAccount(id: string): Promise<ConnectedAccount | undefined>;
  createConnectedAccount(
    account: InsertConnectedAccount,
  ): Promise<ConnectedAccount>;
  updateConnectedAccount(
    id: string,
    updates: Partial<ConnectedAccount>,
  ): Promise<ConnectedAccount | undefined>;
  deleteConnectedAccount(id: string): Promise<void>;

  getPosts(userId: string): Promise<Post[]>;
  getRecentPosts(userId: string, limit?: number): Promise<Post[]>;
  getPost(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, updates: Partial<Post>): Promise<Post | undefined>;
  deletePost(id: string): Promise<void>;

  getTemplates(userId?: string): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(
    id: string,
    updates: Partial<Template>,
  ): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<void>;
  incrementTemplateUsage(id: string): Promise<void>;

  getAnalytics(userId: string): Promise<AnalyticsType[]>;
  createAnalytics(data: InsertAnalytics): Promise<AnalyticsType>;
}

export class FirestoreStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) return undefined;
    return mapUser(doc);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const docRef = usersCollection.doc(userData.id);
    const snapshot = await docRef.get();
    await docRef.set(
      {
        ...userData,
        ...addTimestamps(!snapshot.exists),
      },
      { merge: true },
    );
    const updated = await docRef.get();
    return mapUser(updated);
  }

  async getConnectedAccounts(userId: string): Promise<ConnectedAccount[]> {
    const snapshot = await connectedAccountsCollection
      .where("userId", "==", userId)
      .get();
    return snapshot.docs.map(mapConnectedAccount).sort((a, b) => {
      const aDate = a.createdAt ?? "";
      const bDate = b.createdAt ?? "";
      return bDate.localeCompare(aDate);
    });
  }

  async getConnectedAccount(id: string): Promise<ConnectedAccount | undefined> {
    const doc = await connectedAccountsCollection.doc(id).get();
    if (!doc.exists) return undefined;
    return mapConnectedAccount(doc);
  }

  async createConnectedAccount(
    account: InsertConnectedAccount,
  ): Promise<ConnectedAccount> {
    const docRef = connectedAccountsCollection.doc();
    await docRef.set({
      ...account,
      tokenExpiry: toDateOrUndefined(account.tokenExpiry),
      ...addTimestamps(true),
    });
    return mapConnectedAccount(await docRef.get());
  }

  async updateConnectedAccount(
    id: string,
    updates: Partial<ConnectedAccount>,
  ): Promise<ConnectedAccount | undefined> {
    const docRef = connectedAccountsCollection.doc(id);
    const snapshot = await docRef.get();
    if (!snapshot.exists) return undefined;
    await docRef.set(
      {
        ...updates,
        tokenExpiry: toDateOrUndefined(
          updates.tokenExpiry as TimestampInput | undefined,
        ),
        ...addTimestamps(false),
      },
      { merge: true },
    );
    return mapConnectedAccount(await docRef.get());
  }

  async deleteConnectedAccount(id: string): Promise<void> {
    await connectedAccountsCollection.doc(id).delete();
  }

  async getPosts(userId: string): Promise<Post[]> {
    const snapshot = await postsCollection
      .where("userId", "==", userId)
      .get();
    return snapshot.docs
      .map(mapPost)
      .sort((a, b) => {
        const aDate = a.createdAt ?? "";
        const bDate = b.createdAt ?? "";
        return bDate.localeCompare(aDate);
      });
  }

  async getRecentPosts(userId: string, limit = 10): Promise<Post[]> {
    const snapshot = await postsCollection
      .where("userId", "==", userId)
      .get();
    return snapshot.docs
      .map(mapPost)
      .sort((a, b) => {
        const aDate = a.createdAt ?? "";
        const bDate = b.createdAt ?? "";
        return bDate.localeCompare(aDate);
      })
      .slice(0, limit);
  }

  async getPost(id: string): Promise<Post | undefined> {
    const doc = await postsCollection.doc(id).get();
    if (!doc.exists) return undefined;
    return mapPost(doc);
  }

  async createPost(post: InsertPost): Promise<Post> {
    const docRef = postsCollection.doc();
    const status = post.status ?? (post.scheduledFor ? "scheduled" : "draft");
    await docRef.set({
      ...post,
      scheduledFor: toDateOrUndefined(post.scheduledFor),
      publishedAt: toDateOrUndefined(post.publishedAt),
      status,
      ...addTimestamps(true),
    });
    return mapPost(await docRef.get());
  }

  async updatePost(
    id: string,
    updates: Partial<Post>,
  ): Promise<Post | undefined> {
    const docRef = postsCollection.doc(id);
    const snapshot = await docRef.get();
    if (!snapshot.exists) return undefined;
    await docRef.set(
      {
        ...updates,
        scheduledFor: toDateOrUndefined(
          updates.scheduledFor as TimestampInput | undefined,
        ),
        publishedAt: toDateOrUndefined(
          updates.publishedAt as TimestampInput | undefined,
        ),
        ...addTimestamps(false),
      },
      { merge: true },
    );
    return mapPost(await docRef.get());
  }

  async deletePost(id: string): Promise<void> {
    await postsCollection.doc(id).delete();
  }

  async getTemplates(userId?: string): Promise<Template[]> {
    let query = templatesCollection as Query;
    if (userId) {
      query = query.where("userId", "==", userId);
    } else {
      query = query.where("isPublic", "==", true);
    }
    const snapshot = await query.get();
    return snapshot.docs
      .map(mapTemplate)
      .sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0));
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const doc = await templatesCollection.doc(id).get();
    if (!doc.exists) return undefined;
    return mapTemplate(doc);
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const docRef = templatesCollection.doc();
    await docRef.set({
      ...template,
      usageCount: template.usageCount ?? 0,
      ...addTimestamps(true),
    });
    return mapTemplate(await docRef.get());
  }

  async updateTemplate(
    id: string,
    updates: Partial<Template>,
  ): Promise<Template | undefined> {
    const docRef = templatesCollection.doc(id);
    const snapshot = await docRef.get();
    if (!snapshot.exists) return undefined;
    await docRef.set(
      {
        ...updates,
        ...addTimestamps(false),
      },
      { merge: true },
    );
    return mapTemplate(await docRef.get());
  }

  async deleteTemplate(id: string): Promise<void> {
    await templatesCollection.doc(id).delete();
  }

  async incrementTemplateUsage(id: string): Promise<void> {
    const docRef = templatesCollection.doc(id);
    const snapshot = await docRef.get();
    if (!snapshot.exists) return;
    await docRef.update({
      usageCount: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  async getAnalytics(userId: string): Promise<AnalyticsType[]> {
    const snapshot = await analyticsCollection
      .where("userId", "==", userId)
      .get();
    return snapshot.docs
      .map(mapAnalytics)
      .sort((a, b) => {
        const aDate = a.recordedAt ?? "";
        const bDate = b.recordedAt ?? "";
        return bDate.localeCompare(aDate);
      });
  }

  async createAnalytics(data: InsertAnalytics): Promise<AnalyticsType> {
    const docRef = analyticsCollection.doc();
    await docRef.set({
      ...data,
      recordedAt: toDateOrUndefined(data.recordedAt) ?? FieldValue.serverTimestamp(),
    });
    return mapAnalytics(await docRef.get());
  }
}

export const storage = new FirestoreStorage();
