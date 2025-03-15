import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import multer from "multer";
import {
  addStory,
  getUserStory,
  getFollowStories,viewStory,likeStory,commentOnStory,getStoryComments,deleteStory,updateStory,deleteStoryComment} from "../controllers/story.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ROUTES
// Tạo Story
router.post("/upload", isAuthenticated, upload.single("file"), addStory);
router.post("/create", isAuthenticated, upload.single("file"), addStory);

// Lấy story người dùng 
router.get("/user", isAuthenticated, getUserStory);
router.get("/follow", isAuthenticated, getFollowStories);

//  Xem, Like, Comment, xóxó

router.put("/view/:id", isAuthenticated, viewStory);//id_storistori
router.put("/like/:id", isAuthenticated, likeStory);//id stori lunlun
router.post("/comment/:id", isAuthenticated, commentOnStory); //de còm menmen
router.get("/:id/comments", isAuthenticated, getStoryComments); //de lay dsach
router.delete("/dele/:id", isAuthenticated, deleteStory);
router.put("/upda/:id", isAuthenticated, updateStory); //id stori (update caption)
router.delete("/comment/:commentId", isAuthenticated, deleteStoryComment);

export default router;
