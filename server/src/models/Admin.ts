import { Schema, model } from "mongoose";

const adminSchema = new Schema({
  fullName: String,
  email: String,
  phone: String,
  passwordHash: String,
  profilePicture: String,
});

export const Admin = model("Admin", adminSchema);
