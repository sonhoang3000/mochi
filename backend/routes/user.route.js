import express from "express"
import {
      createConversation,
      editProfile, followOrUnfollow,
      getConversation,
      getFollowers, getFollowing,
      getProfile, getSuggestedUsers, login, logout, register, searchUser
} from "../controllers/user.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/:id/profile").get(isAuthenticated, getProfile)
router.route("/profile/edit").post(isAuthenticated, upload.single('profilePhoto'), editProfile)
router.route('/suggested').get(isAuthenticated, getSuggestedUsers)
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);
router.route('/search/:username').get(isAuthenticated, searchUser)
router.route('/getconversation').get(isAuthenticated, getConversation)
router.route('/createconversation/:id').get(isAuthenticated, createConversation)
router.get("/:id/following", getFollowing);
router.get("/:id/followers", getFollowers);

export default router
