import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { generateChatResponse, generateChatTitle } from "./openai";
import { insertChatSchema, insertRedeemCodeSchema, type ChatMessage } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // User endpoint is now handled by auth middleware
  // /api/login, /api/register, /api/logout, /api/user are all set up in setupAuth

  // Chat routes
  app.get('/api/chats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const chats = await storage.getUserChats(userId);
      res.json(chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ message: "Failed to fetch chats" });
    }
  });

  app.get('/api/chats/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const chatId = parseInt(req.params.id);
      
      if (isNaN(chatId)) {
        return res.status(400).json({ message: "Invalid chat ID" });
      }

      const chat = await storage.getChat(chatId, userId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      res.json(chat);
    } catch (error) {
      console.error("Error fetching chat:", error);
      res.status(500).json({ message: "Failed to fetch chat" });
    }
  });

  app.post('/api/chats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check message limits for free users
      if (!user.isPro) {
        const userChats = await storage.getUserChats(userId);
        const todayMessages = userChats.reduce((count, chat) => {
          const messages = chat.messages as ChatMessage[];
          const today = new Date().toDateString();
          return count + messages.filter(msg => 
            msg.role === "user" && 
            new Date(msg.timestamp).toDateString() === today
          ).length;
        }, 0);

        if (todayMessages >= 10) {
          return res.status(429).json({ 
            message: "Daily message limit reached. Upgrade to Pro for unlimited messages." 
          });
        }
      }

      const chatData = insertChatSchema.parse({
        userId,
        title: "New Chat",
        messages: [],
      });

      const chat = await storage.createChat(chatData);
      res.json(chat);
    } catch (error) {
      console.error("Error creating chat:", error);
      res.status(500).json({ message: "Failed to create chat" });
    }
  });

  app.post('/api/chats/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const chatId = parseInt(req.params.id);
      const { message } = req.body;

      if (isNaN(chatId)) {
        return res.status(400).json({ message: "Invalid chat ID" });
      }

      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Message is required" });
      }

      const chat = await storage.getChat(chatId, userId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check message limits for free users
      if (!user.isPro) {
        const userChats = await storage.getUserChats(userId);
        const todayMessages = userChats.reduce((count, c) => {
          const messages = c.messages as ChatMessage[];
          const today = new Date().toDateString();
          return count + messages.filter(msg => 
            msg.role === "user" && 
            new Date(msg.timestamp).toDateString() === today
          ).length;
        }, 0);

        if (todayMessages >= 10) {
          return res.status(429).json({ 
            message: "Daily message limit reached. Upgrade to Pro for unlimited messages." 
          });
        }
      }

      const currentMessages = chat.messages as ChatMessage[];
      const timestamp = new Date().toISOString();

      // Add user message
      const userMessage: ChatMessage = {
        role: "user",
        content: message,
        timestamp,
      };

      // Generate AI response
      const aiResponse = await generateChatResponse([...currentMessages, userMessage]);
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...currentMessages, userMessage, assistantMessage];

      // Generate title for first message
      let title = chat.title;
      if (currentMessages.length === 0) {
        title = await generateChatTitle(message);
      }

      const updatedChat = await storage.updateChat(chatId, userId, updatedMessages);
      if (!updatedChat) {
        return res.status(404).json({ message: "Failed to update chat" });
      }

      // Update title if it was generated
      if (title !== chat.title) {
        await storage.updateChat(chatId, userId, updatedMessages);
      }

      res.json({ 
        message: assistantMessage,
        chat: { ...updatedChat, title }
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.delete('/api/chats/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const chatId = parseInt(req.params.id);

      if (isNaN(chatId)) {
        return res.status(400).json({ message: "Invalid chat ID" });
      }

      const success = await storage.deleteChat(chatId, userId);
      if (!success) {
        return res.status(404).json({ message: "Chat not found" });
      }

      res.json({ message: "Chat deleted successfully" });
    } catch (error) {
      console.error("Error deleting chat:", error);
      res.status(500).json({ message: "Failed to delete chat" });
    }
  });

  // Redeem code routes
  app.post('/api/redeem', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { code } = req.body;

      if (!code || typeof code !== "string") {
        return res.status(400).json({ message: "Code is required" });
      }

      const success = await storage.useRedeemCode(code.trim().toLowerCase(), userId);
      if (!success) {
        return res.status(400).json({ message: "Invalid or already used code" });
      }

      res.json({ message: "Code redeemed successfully! You now have Pro access." });
    } catch (error) {
      console.error("Error redeeming code:", error);
      res.status(500).json({ message: "Failed to redeem code" });
    }
  });

  // Admin route to create redeem codes (for development/testing)
  app.post('/api/admin/codes', async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code || typeof code !== "string") {
        return res.status(400).json({ message: "Code is required" });
      }

      const codeData = insertRedeemCodeSchema.parse({
        code: code.trim().toLowerCase(),
      });

      const redeemCode = await storage.createRedeemCode(codeData);
      res.json(redeemCode);
    } catch (error) {
      console.error("Error creating redeem code:", error);
      res.status(500).json({ message: "Failed to create redeem code" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
