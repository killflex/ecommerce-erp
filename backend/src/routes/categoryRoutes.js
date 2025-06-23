import express from "express";
import { createCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.route("/").post(createCategory);

export default router;
