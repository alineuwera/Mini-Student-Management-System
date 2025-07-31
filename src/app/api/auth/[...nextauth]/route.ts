// pages/api/admin/students.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // continue with DB logic...
}
