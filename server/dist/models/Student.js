"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const studentSchema = new mongoose_1.Schema({
    fullName: String,
    email: String,
    phone: String,
    passwordHash: String,
    course: String,
    enrollmentYear: Number,
    status: String,
    profilePicture: String,
});
exports.Student = (0, mongoose_1.model)("Student", studentSchema);
