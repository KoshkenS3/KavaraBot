import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertQuizResponseSchema, 
  insertOrderSchema,
  insertNotificationSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/users/telegram/:telegramId", async (req, res) => {
    try {
      const user = await storage.getUserByTelegramId(req.params.telegramId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Quiz responses
  app.post("/api/quiz-responses", async (req, res) => {
    try {
      const quizData = insertQuizResponseSchema.parse(req.body);
      const response = await storage.createQuizResponse(quizData);
      res.json(response);
    } catch (error) {
      res.status(400).json({ error: "Invalid quiz data" });
    }
  });

  app.get("/api/quiz-responses/user/:userId", async (req, res) => {
    try {
      const response = await storage.getQuizResponse(req.params.userId);
      if (!response) {
        return res.status(404).json({ error: "Quiz response not found" });
      }
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/quiz-responses/user/:userId", async (req, res) => {
    try {
      const updateData = req.body;
      const response = await storage.updateQuizResponse(req.params.userId, updateData);
      if (!response) {
        return res.status(404).json({ error: "Quiz response not found" });
      }
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Boxes
  app.get("/api/boxes", async (req, res) => {
    try {
      const category = req.query.category as string;
      let boxes;
      
      if (category) {
        boxes = await storage.getBoxesByCategory(category);
      } else {
        boxes = await storage.getAllBoxes();
      }
      
      res.json(boxes);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/boxes/:id", async (req, res) => {
    try {
      const box = await storage.getBox(req.params.id);
      if (!box) {
        return res.status(404).json({ error: "Box not found" });
      }
      res.json(box);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const orders = await storage.getOrdersByUser(req.params.userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Notifications
  app.post("/api/notifications", async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.json(notification);
    } catch (error) {
      res.status(400).json({ error: "Invalid notification data" });
    }
  });

  app.get("/api/notifications/box/:boxId", async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByBox(req.params.boxId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
