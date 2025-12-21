import { db } from "./db";
import {
  leads,
  type InsertLead,
  type Lead
} from "@shared/schema";

export interface IStorage {
  getLeads(): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
}

export class DatabaseStorage implements IStorage {
  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(leads.createdAt);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }
}

export const storage = new DatabaseStorage();
