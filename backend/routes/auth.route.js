import express from "express";
import { adminLogin } from "../controllers/authLogin.controller.js";

const router = express.Router();

/**
 * Authentication Routes
 *
 * Base Route:
 * /api/auth
 *
 * Available Endpoints:
 * POST /login
 *    → Authenticate Super Admin or Principal
 *    → Returns JWT access token
 */
router.post("/login", adminLogin);

export default router;