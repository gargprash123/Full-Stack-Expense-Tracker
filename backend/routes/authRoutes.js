import express from "express";
import { signinUser, signupUser , googleSignIn} from "../controllers/authController.js";

const router = express.Router();

router.post("/sign-up", signupUser);
router.post("/sign-in", signinUser);
router.post("/google-sign-in", googleSignIn);
export default router;
