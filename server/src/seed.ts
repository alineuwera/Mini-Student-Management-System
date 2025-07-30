// src/seed.ts
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/User";

async function main() {
  try {
    const uri = process.env.MONGO_URI!;
    if (!uri) {
      console.error("❌ MONGO_URI is not set in .env");
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    // --- Admin ---
    const adminEmail = "admin@gmail.com";
    const adminPwd = "Admin@0000";

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        fullName: "Admin User",
        email: adminEmail,
        phone: "0788000000",
        role: "admin",
        passwordHash: await bcrypt.hash(adminPwd, 10),
        imageUrl: "", // optional default
      });
      console.log(`✅ Admin created: ${adminEmail} / ${adminPwd}`);
    } else {
      console.log(`ℹ️ Admin already exists: ${adminEmail}`);
    }

    // --- Student #1 ---
    const s1Email = "alice@gmail.com";
    const s1Pwd = "alice@0000";
    let s1 = await User.findOne({ email: s1Email });
    if (!s1) {
      s1 = await User.create({
        fullName: "Alice Uwimana",
        email: s1Email,
        phone: "0788123456",
        role: "student",
        passwordHash: await bcrypt.hash(s1Pwd, 10),
        course: "Software Engineering",
        enrollmentYear: 2023,
        status: "Active",
        imageUrl: "",
      });
      console.log(`✅ Student created: ${s1Email} / ${s1Pwd}`);
    } else {
      console.log(`ℹ️ Student already exists: ${s1Email}`);
    }

    // --- Student #2 ---
    const s2Email = "hope@gmail.com";
    const s2Pwd = "hope@0000";
    let s2 = await User.findOne({ email: s2Email });
    if (!s2) {
      s2 = await User.create({
        fullName: "Hope Nishimwe",
        email: s2Email,
        phone: "0788234567",
        role: "student",
        passwordHash: await bcrypt.hash(s2Pwd, 10),
        course: "Data Science",
        enrollmentYear: 2022,
        status: "Graduated",
        imageUrl: "",
      });
      console.log(`✅ Student created: ${s2Email} / ${s2Pwd}`);
    } else {
      console.log(`ℹ️ Student already exists: ${s2Email}`);
    }

    console.log("🎉 Seeding complete.");
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
