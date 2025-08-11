import { Router } from "express";
import { storage } from "./storage";
import type { 
  User, 
  QuizResponse, 
  Box, 
  Order, 
  Notification,
  CreateUserDto,
  CreateQuizResponseDto,
  CreateBoxDto,
  CreateOrderDto,
  CreateNotificationDto
} from "@shared/types";

const router = Router();

// Users
router.get("/api/users/:id", async (req, res) => {
  try {
    const user = await storage.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/users/telegram/:telegramId", async (req, res) => {
  try {
    const user = await storage.getUserByTelegramId(req.params.telegramId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by telegram ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/users", async (req, res) => {
  try {
    const { telegramId, username, firstName, lastName } = req.body;
    
    // Check if user already exists
    if (telegramId) {
      const existingUser = await storage.getUserByTelegramId(telegramId);
      if (existingUser) {
        return res.json(existingUser);
      }
    }
    
    // Create new user
    const user = await storage.createUser({
      telegramId,
      username,
      firstName,
      lastName,
    });
    
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Quiz Responses
router.get("/api/quiz-responses/:userId", async (req, res) => {
  try {
    const response = await storage.getQuizResponse(req.params.userId);
    if (!response) {
      return res.status(404).json({ error: "Quiz response not found" });
    }
    res.json(response);
  } catch (error) {
    console.error("Error fetching quiz response:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/quiz-responses", async (req, res) => {
  try {
    const responseData: CreateQuizResponseDto = req.body;
    const response = await storage.createQuizResponse(responseData);
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating quiz response:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/api/quiz-responses/:userId", async (req, res) => {
  try {
    const updateData: Partial<CreateQuizResponseDto> = req.body;
    const response = await storage.updateQuizResponse(req.params.userId, updateData);
    if (!response) {
      return res.status(404).json({ error: "Quiz response not found" });
    }
    res.json(response);
  } catch (error) {
    console.error("Error updating quiz response:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Boxes
router.get("/api/boxes", async (req, res) => {
  try {
    const { category } = req.query;
    let boxes: Box[];
    
    if (category && typeof category === "string") {
      boxes = await storage.getBoxesByCategory(category);
    } else {
      boxes = await storage.getAllBoxes();
    }
    
    res.json(boxes);
  } catch (error) {
    console.error("Error fetching boxes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/boxes/:id", async (req, res) => {
  try {
    const box = await storage.getBox(req.params.id);
    if (!box) {
      return res.status(404).json({ error: "Box not found" });
    }
    res.json(box);
  } catch (error) {
    console.error("Error fetching box:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/boxes", async (req, res) => {
  try {
    const boxData: CreateBoxDto = req.body;
    const box = await storage.createBox(boxData);
    res.status(201).json(box);
  } catch (error) {
    console.error("Error creating box:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Orders
router.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await storage.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/orders/user/:userId", async (req, res) => {
  try {
    const orders = await storage.getOrdersByUser(req.params.userId);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/orders", async (req, res) => {
  try {
    const orderData: CreateOrderDto = req.body;
    const order = await storage.createOrder(orderData);
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Notifications
router.post("/api/notifications", async (req, res) => {
  try {
    const notificationData: CreateNotificationDto = req.body;
    const notification = await storage.createNotification(notificationData);
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/notifications/box/:boxId", async (req, res) => {
  try {
    const notifications = await storage.getNotificationsByBox(req.params.boxId);
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export function registerRoutes(app: any) {
  app.use(router);
}

export default router;