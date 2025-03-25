import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getNotifications, markAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get('/getnoti', isAuthenticated, getNotifications);
router.patch('/:id/read', isAuthenticated, markAsRead);

export default router;
