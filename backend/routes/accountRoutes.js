import express from "express";
import {
  addMoneyToAccount,
  createAccount,
  getAccounts,
} from "../controllers/accountController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAccounts); // check for error, kahi baad mein error aaye to yaha check kro
router.get("/:id", authMiddleware, getAccounts);
router.post("/create", authMiddleware, createAccount);
router.put("/add-money/:id", authMiddleware, addMoneyToAccount);

export default router;
