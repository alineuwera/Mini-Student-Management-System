"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Register
router.post("/register", async (req, res) => {
    const { fullName, email, phone, password } = req.body;
    try {
        const existing = await User_1.User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "Email already used" });
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = await User_1.User.create({ fullName, email, phone, passwordHash });
        res.status(201).json({ message: "User registered", user });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
// Login
// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const valid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!valid)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ message: "Login success", user, token });
    }
    catch {
        res.status(500).json({ message: "Server error" });
    }
});
// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});
exports.default = router;
