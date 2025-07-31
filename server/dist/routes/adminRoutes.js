"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = require("../middleware/auth");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Multer setup (same storage as user routes)
const uploadDir = path_1.default.join(__dirname, "../../uploads");
if (!fs_1.default.existsSync(uploadDir))
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = (0, multer_1.default)({ storage });
// List all students
router.get("/students", (0, auth_1.auth)(["admin"]), async (_req, res) => {
    const students = await User_1.User.find({ role: "student" }).select("-passwordHash");
    res.json(students);
});
// Add student (default password set)
router.post("/students", (0, auth_1.auth)(["admin"]), async (req, res) => {
    const { fullName, email, phone, course, enrollmentYear, status } = req.body;
    const existing = await User_1.User.findOne({ email });
    if (existing)
        return res.status(400).json({ message: "Email already exists" });
    const passwordHash = await bcrypt_1.default.hash("Student@123", 10);
    const student = await User_1.User.create({
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
router.put("/students/:id", (0, auth_1.auth)(["admin"]), async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "Invalid student id" });
    const updated = await User_1.User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    }).select("-passwordHash");
    if (!updated)
        return res.status(404).json({ message: "Student not found" });
    res.json(updated);
});
// Delete student
router.delete("/students/:id", (0, auth_1.auth)(["admin"]), async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "Invalid student id" });
    const deleted = await User_1.User.findByIdAndDelete(id);
    if (!deleted)
        return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
});
// Change a user's role (admin <-> student)
router.patch("/users/:id/role", (0, auth_1.auth)(["admin"]), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "Invalid user id" });
    if (!["admin", "student"].includes(role))
        return res.status(400).json({ message: "Invalid role value" });
    const target = await User_1.User.findById(id);
    if (!target)
        return res.status(404).json({ message: "User not found" });
    // Prevent self-demotion
    const caller = req.user;
    if (caller?.userId === String(target._id) && role !== "admin") {
        return res
            .status(400)
            .json({ message: "You cannot remove your own admin role." });
    }
    // Prevent demoting last admin
    if (target.role === "admin" && role === "student") {
        const adminCount = await User_1.User.countDocuments({ role: "admin" });
        if (adminCount <= 1) {
            return res
                .status(400)
                .json({ message: "Cannot demote the last remaining admin." });
        }
    }
    const updated = await User_1.User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).select("-passwordHash");
    res.json({ message: "Role updated", user: updated });
});
// Admin upload profile picture for any user (accept ANY file field)
router.post("/users/:id/profile-picture", (0, auth_1.auth)(["admin"]), upload.any(), async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "Invalid user id" });
    const files = req.files;
    if (!files || files.length === 0)
        return res.status(400).json({ message: "No file uploaded" });
    const relative = `/uploads/${files[0].filename}`;
    const updated = await User_1.User.findByIdAndUpdate(id, { imageUrl: relative }, { new: true }).select("-passwordHash");
    if (!updated)
        return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile picture updated", user: updated });
});
// GET /api/admin/students/stats
router.get("/students/stats", (0, auth_1.auth)(["admin"]), async (_req, res) => {
    try {
        const total = await User_1.User.countDocuments({ role: "student" });
        const active = await User_1.User.countDocuments({ role: "student", status: "Active" });
        const graduated = await User_1.User.countDocuments({ role: "student", status: "Graduated" });
        res.json({
            totalStudents: total,
            activeStudents: active,
            graduatedStudents: graduated,
        });
    }
    catch (error) {
        console.error("Error fetching student stats:", error);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
});
exports.default = router;
