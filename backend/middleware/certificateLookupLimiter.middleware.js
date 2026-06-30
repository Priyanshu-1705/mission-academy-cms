import rateLimit from "express-rate-limit";

/**
 * Certificate Lookup Rate Limiter
 *
 * Purpose:
 * Restricts how many transfer certificate lookup attempts a single
 * IP address can make in a given time window.
 *
 * Responsibilities:
 * - Cap requests to the public, no-auth certificate lookup endpoint.
 *
 * Notes:
 * This endpoint is the only one in the app where an anonymous
 * visitor can query by a guessable identifier (admission number).
 * Without this limit, someone could script through a large range
 * of admission numbers and harvest real students' transfer
 * certificates. This does not stop a slow, manual attempt by one
 * person — it specifically targets automated bulk scraping.
 */
export const certificateLookupLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,

    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: false,

    message: {
        success: false,
        message:
            "Too many lookup attempts. Please try again later."
    }
});