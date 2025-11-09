export type TimestampString = string | undefined;
export type TimestampInput = string | Date | undefined;

export interface User {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  createdAt?: TimestampString;
  updatedAt?: TimestampString;
}

export type UpsertUser = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
};

export interface ConnectedAccount {
  id: string;
  userId: string;
  platform: string;
  accountName?: string | null;
  accountId?: string | null;
  followers?: number | null;
  isConnected?: boolean;
  accessToken?: string | null;
  refreshToken?: string | null;
  tokenExpiry?: TimestampString;
  metadata?: Record<string, unknown> | null;
  createdAt?: TimestampString;
  updatedAt?: TimestampString;
}

export type InsertConnectedAccount = Omit<
  ConnectedAccount,
  "id" | "createdAt" | "updatedAt"
> & {
  userId: string;
  platform: string;
  tokenExpiry?: TimestampInput;
};

export type PostStatus = "draft" | "scheduled" | "published" | "failed";

export interface Post {
  id: string;
  userId: string;
  content: string;
  platforms: string[];
  mediaUrls?: string[];
  scheduledFor?: TimestampString;
  status: PostStatus;
  publishedAt?: TimestampString;
  metadata?: Record<string, unknown> | null;
  createdAt?: TimestampString;
  updatedAt?: TimestampString;
}

export type InsertPost = Omit<
  Post,
  "id" | "createdAt" | "updatedAt" | "status" | "publishedAt"
> & {
  status?: PostStatus;
  scheduledFor?: TimestampInput;
  publishedAt?: TimestampInput;
};

export interface Template {
  id: string;
  userId?: string | null;
  name: string;
  description?: string | null;
  category?: string | null;
  content: string;
  platforms: string[];
  isPublic?: boolean;
  usageCount?: number;
  createdAt?: TimestampString;
  updatedAt?: TimestampString;
}

export type InsertTemplate = Omit<
  Template,
  "id" | "createdAt" | "updatedAt" | "usageCount"
> & {
  usageCount?: number;
};

export interface Analytics {
  id: string;
  userId: string;
  postId?: string | null;
  platform: string;
  likes?: number;
  shares?: number;
  comments?: number;
  reach?: number;
  engagementRate?: number;
  recordedAt?: TimestampString;
}

export type InsertAnalytics = Omit<Analytics, "id" | "recordedAt"> & {
  recordedAt?: TimestampInput;
};
