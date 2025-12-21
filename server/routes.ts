import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existingLeads = await storage.getLeads();
  if (existingLeads.length === 0) {
    await storage.createLead({
      name: "Sarah Johnson",
      email: "sarah@techcorp.com",
      company: "TechCorp",
      interest: "Interested in API automation",
      phone: "555-0123"
    });
    await storage.createLead({
      name: "Michael Chen",
      email: "michael@startup.io",
      company: "StartupIO",
      interest: "CRM integration",
      phone: "555-0124"
    });
    await storage.createLead({
      name: "Emma Williams",
      email: "emma@enterprise.com",
      company: "Enterprise Co",
      interest: "Workflow tools",
      phone: "555-0125"
    });
    await storage.createLead({
      name: "James Brown",
      email: "james@innovation.ai",
      company: "Innovation AI",
      interest: "Lead capture solutions",
      phone: "555-0126"
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.leads.list.path, async (req, res) => {
    const leads = await storage.getLeads();
    res.json(leads);
  });

  app.post(api.leads.create.path, async (req, res) => {
    try {
      const input = api.leads.create.input.parse(req.body);
      const lead = await storage.createLead(input);
      res.status(201).json(lead);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed on startup
  seedDatabase().catch(console.error);

  return httpServer;
}
