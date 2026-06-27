import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import bannerRoutes from "./routes/banner.route.js";
import publicRoutes from "./routes/public.route.js";
import leaderRoutes from "./routes/leader.route.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());   

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Mission Academy Baheri API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/leaders", leaderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});