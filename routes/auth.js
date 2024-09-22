import express from "express";
import { loginUser, logoutUser, signupUser } from "../controllers/auth.js";

const router = express.Router();

router.post("/signin", loginUser);
router.post("/signup", signupUser);

router.get("/logout", logoutUser);

export default router;
