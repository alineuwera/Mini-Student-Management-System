import express, { Request, Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { auth } from "../middleware/auth";
import { User } from "../models/User";

const router = express.Router();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, _file) => {
    return {
      folder: "profile_pictures",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: `${Date.now()}-profile`,
    };
  },
});

const upload = multer({ storage });

// GET my profile
router.get("/me", auth(), async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const user = await User.findById(userId).select("-passwordHash");
  res.json(user);
});

// UPDATE my profile details
router.put("/me", auth(), async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  await User.findByIdAndUpdate(userId, req.body, { runValidators: true });
  res.json({ message: "Profile updated" });
});

// UPLOAD profile picture to Cloudinary
router.post("/me/profile-picture", auth(), upload.single("profilePicture"), async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const file = req.file as any;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { imageUrl: file.path },  // Cloudinary URL
    { new: true }
  ).select("-passwordHash");

  res.json({ message: "Profile picture updated", user: updatedUser });
});

export default router;
