import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone?: string;
  role: "admin" | "student";
  passwordHash: string;
  imageUrl?: string;                 // stored in DB
  profilePicture?: string;           // virtual alias to imageUrl
  course?: string;
  enrollmentYear?: number;
  status?: "Active" | "Graduated" | "Dropped";
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    role: { type: String, enum: ["admin", "student"], default: "student" },
    passwordHash: { type: String, required: true },
    imageUrl: String, // we persist this
    course: String,
    enrollmentYear: Number,
    status: { type: String, enum: ["Active", "Graduated", "Dropped"] }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual alias so you can use profilePicture in API while storing imageUrl
userSchema.virtual("profilePicture")
  .get(function (this: any) {
    return this.imageUrl;
  })
  .set(function (this: any, v: string) {
    this.imageUrl = v;
  });

export const User = mongoose.model<IUser>("User", userSchema);
