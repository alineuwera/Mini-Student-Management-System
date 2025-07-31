"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Ensure uploads dir exists
const uploadDir = path_1.default.join(__dirname, "../../uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = (0, multer_1.default)({ storage });
// GET my profile
router.get("/me", (0, auth_1.auth)(), async (req, res) => {
    const userId = req.user.userId;
    const user = await User_1.User.findById(userId).select("-passwordHash");
    res.json(user);
});
// UPDATE my profile
router.put("/me", (0, auth_1.auth)(), async (req, res) => {
    const userId = req.user.userId;
    await User_1.User.findByIdAndUpdate(userId, req.body, { runValidators: true });
    res.json({ message: "Profile updated" });
});
// UPLOAD my profile picture (accept ANY file field name)
router.post("/me/profile-picture", (0, auth_1.auth)(), upload.any(), async (req, res) => {
    const userId = req.user.userId;
    const files = req.files;
    if (!files || files.length === 0) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const relative = `/uploads/${files[0].filename}`;
    const updated = await User_1.User.findByIdAndUpdate(userId, { imageUrl: relative }, // also appears as profilePicture via virtual
    { new: true }).select("-passwordHash");
    res.json({ message: "Profile picture updated", user: updated });
});
exports.default = router;
