import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getNotifications, markAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get('/getnoti', isAuthenticated, getNotifications);
// router.put('/:id/read', isAuthenticated, markAsRead);
<<<<<<< HEAD
router.put('/:id/read', isAuthenticated, (req, res, next) => {
    console.log(`Received PUT request for notification ID: ${req.params.id}`);
    next();
}, markAsRead);
=======
router.put('/:id/read', isAuthenticated, (req, res, next) => {next();}, markAsRead);
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
export default router;
