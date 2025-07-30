import { Schema, model } from "mongoose";

const studentSchema = new Schema({
  fullName: String,
  email: String,
  phone: String,
  passwordHash: String,
  course: String,
  enrollmentYear: Number,
  status: String,
  profilePicture: String,
});

export const Student = model("Student", studentSchema);
