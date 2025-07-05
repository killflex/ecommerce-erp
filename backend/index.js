// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fs from "fs";

// Utiles
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import createPlaceholderImage from "./utils/placeholder.js";
import "./utils/ensureUploadsDir.js";

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

// Create placeholder image on startup
createPlaceholderImage();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

const __dirname = path.resolve();

// Custom middleware to handle missing images
app.use("/uploads", (req, res, next) => {
  const filePath = path.join(__dirname, "uploads", req.path);

  // Check if file exists
  if (fs.existsSync(filePath)) {
    next(); // File exists, continue to static middleware
  } else {
    // File doesn't exist, serve placeholder image
    console.log(`Image not found: ${filePath}, serving placeholder`);
    const placeholderPath = path.join(__dirname, "uploads", "placeholder.svg");
    res.sendFile(placeholderPath);
  }
});

app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(port, () => console.log(`Server running on port: ${port}`));
