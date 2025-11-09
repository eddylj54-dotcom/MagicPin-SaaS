import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { isAuthenticated, type AuthenticatedRequest } from "./firebaseAuth";
import { generateSocialMediaContent } from "./gemini";
import { PLATFORMS } from "@shared/platforms";

export async function registerRoutes(app: Express): Promise<Server> {

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Connected Accounts routes
  app.get("/api/accounts", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      const accounts = await storage.getConnectedAccounts(userId);
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      res.status(500).json({ message: "Failed to fetch accounts" });
    }
  });

  app.post("/api/accounts/connect", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      const { platform } = req.body;

      // Validate platform
      if (!platform || typeof platform !== 'string') {
        return res.status(400).json({ message: "Valid platform is required" });
      }

      const validPlatforms = PLATFORMS.map(p => p.id);
      if (!validPlatforms.includes(platform)) {
        return res.status(400).json({ message: "Invalid platform" });
      }

      // Simulate OAuth connection with mock data
      const mockAccountNames = ["user_account", "brand_official", "creator_pro"];
      const mockFollowers = [1250, 5680, 12450, 24890, 45620];

      const account = await storage.createConnectedAccount({
        userId,
        platform,
        accountName: mockAccountNames[Math.floor(Math.random() * mockAccountNames.length)] + Math.floor(Math.random() * 1000),
        accountId: `${platform}_${Date.now()}`,
        followers: mockFollowers[Math.floor(Math.random() * mockFollowers.length)],
        isConnected: true,
        accessToken: `mock_token_${Date.now()}`,
        metadata: { connected_at: new Date().toISOString() },
      });

      res.json(account);
    } catch (error) {
      console.error("Error connecting account:", error);
      res.status(500).json({ message: "Failed to connect account" });
    }
  });

  app.post("/api/accounts/:id/disconnect", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      await storage.deleteConnectedAccount(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error disconnecting account:", error);
      res.status(500).json({ message: "Failed to disconnect account" });
    }
  });

  // Posts routes
  app.get("/api/posts", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      const posts = await storage.getPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/recent", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      const posts = await storage.getRecentPosts(userId, 10);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching recent posts:", error);
      res.status(500).json({ message: "Failed to fetch recent posts" });
    }
  });

  app.post("/api/posts", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      const { content, platforms, scheduledFor, mediaUrls, metadata } = req.body;

      // Validate input
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ message: "Valid content is required" });
      }

      if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
        return res.status(400).json({ message: "At least one platform is required" });
      }

      const validPlatforms = PLATFORMS.map(p => p.id);
      const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
      if (invalidPlatforms.length > 0) {
        return res.status(400).json({ message: `Invalid platforms: ${invalidPlatforms.join(', ')}` });
      }

      const post = await storage.createPost({
        userId,
        content,
        platforms,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
        mediaUrls: mediaUrls || [],
        status: scheduledFor ? "scheduled" : "draft",
        metadata: metadata || {},
      });

      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // AI Content Generation route
  app.post("/api/ai/generate", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { topic, tone, platforms } = req.body;

      // Validate input
      if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
        return res.status(400).json({ message: "Valid topic is required" });
      }

      if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
        return res.status(400).json({ message: "At least one platform is required" });
      }

      const validPlatforms = PLATFORMS.map(p => p.id);
      const invalidPlatforms = platforms.filter((p: string) => !validPlatforms.includes(p));
      if (invalidPlatforms.length > 0) {
        return res.status(400).json({ message: `Invalid platforms: ${invalidPlatforms.join(', ')}` });
      }

      const validTones = ['professional', 'casual', 'enthusiastic', 'educational', 'promotional', 'inspirational'];
      const sanitizedTone = tone && validTones.includes(tone) ? tone : 'professional';

      const content = await generateSocialMediaContent(topic, sanitizedTone, platforms);
      res.json({ content });
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });

  // Templates routes
  app.get("/api/templates", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      const templates = await storage.getTemplates(userId);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.post("/api/templates", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      const { name, description, category, content, platforms, isPublic } = req.body;

      // Validate input
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ message: "Valid name is required" });
      }

      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ message: "Valid content is required" });
      }

      if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
        return res.status(400).json({ message: "At least one platform is required" });
      }

      const validPlatforms = PLATFORMS.map(p => p.id);
      const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
      if (invalidPlatforms.length > 0) {
        return res.status(400).json({ message: `Invalid platforms: ${invalidPlatforms.join(', ')}` });
      }

      const template = await storage.createTemplate({
        userId,
        name,
        description,
        category,
        content,
        platforms,
        isPublic: isPublic || false,
        usageCount: 0,
      });

      res.json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  app.post("/api/templates/:id/use", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      await storage.incrementTemplateUsage(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error using template:", error);
      res.status(500).json({ message: "Failed to use template" });
    }
  });

  // Analytics routes
  app.get("/api/analytics", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      const analytics = await storage.getAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
