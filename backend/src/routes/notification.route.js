import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getNotifications, deleteNotification } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.get("/:notifiationId", protectRoute, deleteNotification);

export default router;