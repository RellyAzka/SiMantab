import { NextFunction, Request, Response } from "express";
import { SECRET } from "../global";
import { verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      status: false,
      message: "Access denied. No token provided",
    });
  }

  try {
    const secretKey = SECRET || "";
    const decoded = verify(token, secretKey);
    req.body.user = decoded as JwtPayload;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Token is invalid",
    });
  }
};

export const verifyRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to access this resource" });
    }
    next();
  };
};

export const verifyProductOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      status: false,
      message: "Access denied. No token provided",
    });
  }

  const secretKey = SECRET || "";

  if (!secretKey) {
    return res.status(500).json({
      status: false,
      message: "Server configuration error: JWT secret is not defined.",
    });
  }

  try {
    const decoded = verify(token, secretKey) as JwtPayload;

    if (decoded.role === "ADMIN" || decoded.role === "SUPER_ADMIN") {
      req.body.user = decoded;
      return next();
    }

    const products = await prisma.product.findMany({
      where: { sellerId: decoded.id },
    });

    if (!products.length) {
      return res.status(404).json({
        status: false,
        message: "No products found or you do not have access.",
      });
    }

    req.body.user = decoded;
    req.body.products = products;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Token is invalid or expired.",
    });
  }
};