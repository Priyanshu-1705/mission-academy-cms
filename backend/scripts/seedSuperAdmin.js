import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.model.js";


dotenv.config();

// One-time script to create the first Super Admin account.
//
// Run manually from the terminal with: node utils/seedSuperAdmin.util.js
//
// This is intentionally NOT a route — there is no API endpoint that
// creates a Super Admin, since the auth design says only the
// development team creates this account, once, and the school
// can never create or delete it through the CMS.
const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        // console.log("Connected to MongoDB for seeding...");

        const existingAdmin = await User.findOne({ role: "super_admin" });

        if (existingAdmin) {
            console.log(`A Super Admin already exists: ${existingAdmin.email}`);
            console.log("Seeding skipped. Delete the existing Super Admin manually first if you need to re-seed.");
            process.exit(0);
        }

        // CHANGE THESE before running — this is your real login.
        const name = process.env.SUPER_ADMIN_NAME || "Admin";
        const email = process.env.SUPER_ADMIN_EMAIL || "admin@missionacademybaheri.com";
        const plainPassword = process.env.SUPER_ADMIN_PASSWORD || "ChangeThisPassword123";

        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const superAdmin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "super_admin",
            isActive: true
        });

        console.log("Super Admin created successfully:");
        console.log(`  Name: ${superAdmin.name}`);
        console.log(`  Email: ${superAdmin.email}`);
        console.log("  Remember to log in and change this password if you used the placeholder.");

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exit(1);
    }
};

seedSuperAdmin();