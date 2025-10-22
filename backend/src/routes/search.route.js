import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js"
import { search } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/:query", protectRoute, search);



export default router;

