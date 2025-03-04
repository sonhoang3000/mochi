import express from "express"
import { addStory } from "../controllers/story.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multerFile.js"

const router = express.Router()

router.post("/upload", isAuthenticated, upload.single("file"), addStory);

export default router
