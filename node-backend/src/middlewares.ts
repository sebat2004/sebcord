import { NextFunction, Request, Response } from "express";

import ErrorResponse from "./interfaces/ErrorResponse";

const jwt = require("jsonwebtoken");
const secretKey =
  process.env.AUTH_SECRET_KEY || "ct3kpaBx2FRlwZEakQb9D4gYalEWrrly5BUyTuWGJFU=";

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];

  if (!accessToken && !refreshToken)
    return res.status(401).send("Access Denied. No token provided.");

  if (!accessToken)
    try {
      // Valid access‑token
      const decoded: any = jwt.verify(accessToken, secretKey);
      req.user = decoded.user;
      return next();
    } catch {
      console.log("Access token expired, trying refresh token");
    }

  // Try refresh‑token
  if (!refreshToken)
    return res.status(401).send("Access Denied. No refresh token provided.");

  try {
    const decoded: any = jwt.verify(refreshToken, secretKey);
    const newAccess = jwt.sign({ user: decoded.user }, secretKey, {
      expiresIn: "1h",
    });

    // Attach user
    req.user = decoded.user;
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .header("Authorization", `Bearer ${newAccess}`);

    return next(); // 👈 continue to the route handler
  } catch {
    return res.status(400).send("Invalid refresh token.");
  }
};
