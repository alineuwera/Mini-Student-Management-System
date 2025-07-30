import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  role: "admin" | "student";
}

export const auth = (roles?: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: "Not authenticated" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      (req as any).user = decoded;

      if (roles && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
