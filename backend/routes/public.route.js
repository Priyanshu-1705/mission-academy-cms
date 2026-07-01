import express from "express";
import { getPublicBanners } from "../controllers/banner.controller.js";
import { getPublicLeaders } from "../controllers/leader.controller.js";
import { getPublicEvents } from "../controllers/event.controller.js";
import { getPublicAlbums } from "../controllers/album.controller.js";
import { getPublicBoardAchievers } from "../controllers/boardAchiever.controller.js";
import { getPublicOtherAchievements } from "../controllers/otherAchievement.controller.js";


const router = express.Router();

// Retrieve only active banners (Public Homepage)
router.get("/banners", getPublicBanners);

// Retrieve all leaders (Public About Page)
router.get("/leaders", getPublicLeaders);

// Retrieve all events (Public Events Page)
router.get("/events", getPublicEvents);

// Retrieve all albums (Public Gallery Page)
router.get("/albums", getPublicAlbums);

// Retrieve all board achievers (Public Achievements Page)
router.get("/board-achievers", getPublicBoardAchievers);

// Retrieve all other achievements (Public Achievements Page)
router.get("/other-achievements", getPublicOtherAchievements);


export default router;