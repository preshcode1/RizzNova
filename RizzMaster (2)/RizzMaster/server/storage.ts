import {
  users,
  chats,
  redeemCodes,
  type User,
  type UpsertUser,
  type InsertUser,
  type Chat,
  type InsertChat,
  type RedeemCode,
  type InsertRedeemCode,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Chat operations
  getUserChats(userId: string): Promise<Chat[]>;
  getChat(id: number, userId: string): Promise<Chat | undefined>;
  createChat(chat: InsertChat): Promise<Chat>;
  updateChat(id: number, userId: string, messages: any[]): Promise<Chat | undefined>;
  deleteChat(id: number, userId: string): Promise<boolean>;
  
  // Redeem code operations
  getRedeemCode(code: string): Promise<RedeemCode | undefined>;
  useRedeemCode(code: string, userId: string): Promise<boolean>;
  createRedeemCode(redeemCode: InsertRedeemCode): Promise<RedeemCode>;
}

export class DatabaseStorage implements IStorage {
  // User operations

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const userId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        id: userId,
      })
      .returning();
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

  // Chat operations
  async getUserChats(userId: string): Promise<Chat[]> {
    return await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.updatedAt));
  }

  async getChat(id: number, userId: string): Promise<Chat | undefined> {
    const [chat] = await db
      .select()
      .from(chats)
      .where(and(eq(chats.id, id), eq(chats.userId, userId)));
    return chat;
  }

  async createChat(chat: InsertChat): Promise<Chat> {
    const [newChat] = await db.insert(chats).values(chat).returning();
    return newChat;
  }

  async updateChat(id: number, userId: string, messages: any[]): Promise<Chat | undefined> {
    const [updatedChat] = await db
      .update(chats)
      .set({ 
        messages,
        updatedAt: new Date(),
      })
      .where(and(eq(chats.id, id), eq(chats.userId, userId)))
      .returning();
    return updatedChat;
  }

  async deleteChat(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(chats)
      .where(and(eq(chats.id, id), eq(chats.userId, userId)));
    return (result.rowCount || 0) > 0;
  }

  // Redeem code operations
  async getRedeemCode(code: string): Promise<RedeemCode | undefined> {
    const [redeemCode] = await db
      .select()
      .from(redeemCodes)
      .where(eq(redeemCodes.code, code));
    return redeemCode;
  }

  async useRedeemCode(code: string, userId: string): Promise<boolean> {
    const redeemCode = await this.getRedeemCode(code);
    if (!redeemCode || redeemCode.used) {
      return false;
    }

    // Mark code as used and upgrade user to pro
    await db.transaction(async (tx) => {
      await tx
        .update(redeemCodes)
        .set({
          used: true,
          usedById: userId,
          usedAt: new Date(),
        })
        .where(eq(redeemCodes.code, code));

      await tx
        .update(users)
        .set({
          isPro: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    });

    return true;
  }

  async createRedeemCode(redeemCode: InsertRedeemCode): Promise<RedeemCode> {
    const [newCode] = await db.insert(redeemCodes).values(redeemCode).returning();
    return newCode;
  }
}

export const storage = new DatabaseStorage();
