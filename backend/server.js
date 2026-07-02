import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import bannerRoutes from "./routes/banner.route.js";
import publicRoutes from "./routes/public.route.js";
import leaderRoutes from "./routes/leader.route.js";
import eventRoutes from "./routes/event.route.js";
import albumRoutes from "./routes/album.route.js";
import transferCertificateRoutes from "./routes/transferCertificate.route.js";
import boardAchieverRoutes from "./routes/boardAchiever.route.js";
import otherAchievementRoutes from "./routes/otherAchievement.route.js";
import disclosureRoutes from "./routes/disclosure.route.js";
import registrationRoutes from "./routes/registration.route.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());   

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Mission Academy Baheri API is running" });
});

// Public
app.use("/api/public", publicRoutes);

// Authentication
app.use("/api/auth", authRoutes);

// CMS Modules
app.use("/api/banners", bannerRoutes);
app.use("/api/leaders", leaderRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/board-achievers", boardAchieverRoutes);
app.use("/api/other-achievements", otherAchievementRoutes);
app.use("/api/transfer-certificates", transferCertificateRoutes);
app.use("/api/disclosures", disclosureRoutes);
app.use("/api/registrations", registrationRoutes);

// Error handling
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found."
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});