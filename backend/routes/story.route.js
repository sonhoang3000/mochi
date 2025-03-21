import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import multer from "multer";
import {
  addStory,
  getUserStory,
  getFollowStories, viewStory, likeOrDislikeStory, commentOnStory, getStoryComments, deleteStory, updateStory, deleteStoryComment
} from "../controllers/story.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ROUTES
// Tạo Story
router.post("/upload", isAuthenticated, upload.single("file"), addStory);
router.post("/create", isAuthenticated, upload.single("file"), addStory);

// Lấy story người dùng 
router.get("/getuserstory", isAuthenticated, getUserStory);
router.get("/follow", isAuthenticated, getFollowStories);

//  Xem, Like, Comment, xóxó

router.put("/view/:id", isAuthenticated, viewStory);//id_storistori
router.put("/:id/likeordislike", isAuthenticated, likeOrDislikeStory);//id stori lunlun
router.post("/comment/:id", isAuthenticated, commentOnStory); //de còm menmen
router.get("/:id/getcomments", isAuthenticated, getStoryComments); //de lay dsach
router.delete("/delete/:id", isAuthenticated, deleteStory);
router.put("/updatestory/:id", isAuthenticated, updateStory); //id stori (update caption)
router.delete("/comment/:commentId", isAuthenticated, deleteStoryComment);

export default router;
