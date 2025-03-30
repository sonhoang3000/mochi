import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getNotifications, markAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get('/getnoti', isAuthenticated, getNotifications);
// router.put('/:id/read', isAuthenticated, markAsRead);
router.put('/:id/read', isAuthenticated, (req, res, next) => {next();}, markAsRead);
export default router;
