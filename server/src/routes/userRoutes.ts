import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { auth } from "../middleware/auth";
import { User } from "../models/User";

const router = express.Router();

// Ensure uploads dir exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// GET my profile
router.get("/me", auth(), async (req, res) => {
  const userId = (req as any).user.userId;
  const user = await User.findById(userId).select("-passwordHash");
  res.json(user);
});

// UPDATE my profile
router.put("/me", auth(), async (req, res) => {
  const userId = (req as any).user.userId;
  await User.findByIdAndUpdate(userId, req.body, { runValidators: true });
  res.json({ message: "Profile updated" });
});

// UPLOAD my profile picture (accept ANY file field name)
router.post("/me/profile-picture", auth(), upload.any(), async (req, res) => {
  const userId = (req as any).user.userId;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const relative = `/uploads/${files[0].filename}`;
  const updated = await User.findByIdAndUpdate(
    userId,
    { imageUrl: relative }, // also appears as profilePicture via virtual
    { new: true }
  ).select("-passwordHash");

  res.json({ message: "Profile picture updated", user: updated });
});

export default router;
