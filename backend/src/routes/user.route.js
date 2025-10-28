import express from "express";
import { getUserProfile, updateUserProfile, syncUser, getCurrentUser, followUser, changeUserDp } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/upload.middleware.js"

const router = express.Router();

router.get("/profile/:username", getUserProfile);

router.post("/sync", protectRoute, syncUser);
router.get("/me", protectRoute, getCurrentUser);
router.put("/profile", protectRoute, updateUserProfile)
router.put("/profile/dp", protectRoute, upload.single("dp"), changeUserDp)
router.post("/follow/:targetUserId",protectRoute, followUser);

export default router