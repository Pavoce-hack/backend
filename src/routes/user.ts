import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  loginUser,
  updateUser,
} from "../controllers/user";
import { verifyToken } from "../utils/validation";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/all", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUser);

export default router;
