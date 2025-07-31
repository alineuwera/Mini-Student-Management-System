import express from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { auth } from "../middleware/auth";
import { User } from "../models/User";

const router = express.Router();

// Multer setup (same storage as user routes)
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// List all students
router.get("/students", auth(["admin"]), async (_req, res) => {
  const students = await User.find({ role: "student" }).select("-passwordHash");
  res.json(students);
});

// Add student (default password set)
router.post("/students", auth(["admin"]), async (req, res) => {
  const { fullName, email, phone, course, enrollmentYear, status } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already exists" });

  const passwordHash = await bcrypt.hash("Student@123", 10);

  const student = await User.create({
    fullName,
    email,
    phone,
    role: "student",
    passwordHash,
    course,
    enrollmentYear,
    status,
  });

  res.status(201).json(student);
});

// Update student
router.put("/students/:id", auth(["admin"]), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid student id" });

  const updated = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).select("-passwordHash");

  if (!updated) return res.status(404).json({ message: "Student not found" });
  res.json(updated);
});

// Delete student
router.delete("/students/:id", auth(["admin"]), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid student id" });

  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "Student not found" });

  res.json({ message: "Student deleted" });
});

// Change a user's role (admin <-> student)
router.patch("/users/:id/role", auth(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { role } = req.body as { role: "admin" | "student" };

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid user id" });
  if (!["admin", "student"].includes(role))
    return res.status(400).json({ message: "Invalid role value" });

  const target = await User.findById(id);
  if (!target) return res.status(404).json({ message: "User not found" });

  // Prevent self-demotion
  const caller = (req as any).user;
  if (caller?.userId === String(target._id) && role !== "admin") {
    return res
      .status(400)
      .json({ message: "You cannot remove your own admin role." });
  }

  // Prevent demoting last admin
  if (target.role === "admin" && role === "student") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return res
        .status(400)
        .json({ message: "Cannot demote the last remaining admin." });
    }
  }

  const updated = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select("-passwordHash");

  res.json({ message: "Role updated", user: updated });
});

// Admin upload profile picture for any user (accept ANY file field)
router.post(
  "/users/:id/profile-picture",
  auth(["admin"]),
  upload.any(),
  async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid user id" });

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0)
      return res.status(400).json({ message: "No file uploaded" });

    const relative = `/uploads/${files[0].filename}`;
    const updated = await User.findByIdAndUpdate(
      id,
      { imageUrl: relative },
      { new: true }
    ).select("-passwordHash");

    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile picture updated", user: updated });
  }
);
// GET /api/admin/students/stats
router.get("/students/stats", auth(["admin"]), async (_req, res) => {
  try {
    const total = await User.countDocuments({ role: "student" });
    const active = await User.countDocuments({ role: "student", status: "Active" });
    const graduated = await User.countDocuments({ role: "student", status: "Graduated" });

    res.json({
      totalStudents: total,
      activeStudents: active,
      graduatedStudents: graduated,
    });
  } catch (error) {
    console.error("Error fetching student stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

export default router;
