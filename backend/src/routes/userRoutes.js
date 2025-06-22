import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(createUser).get(authMiddleware, isAdmin, getAllUsers);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(authMiddleware, getCurrentUserProfile)
  .put(authMiddleware, updateCurrentUserProfile);

// Admin Routes
router
  .route("/:id")
  .delete(authMiddleware, isAdmin, deleteUserById)
  .get(authMiddleware, isAdmin, getUserById)
  .put(authMiddleware, isAdmin, updateUserById);

export default router;
