import express from "express";
import { getNotifications, markAsRead } from "../controllers/notification.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get('/getnoti', isAuthenticated, getNotifications);
// router.put('/:id/read', isAuthenticated, markAsRead);
router.put('/:id/read', isAuthenticated, (req, res, next) => {
    console.log(`Received PUT request for notification ID: ${req.params.id}`);
    next();
}, markAsRead);
export default router;
