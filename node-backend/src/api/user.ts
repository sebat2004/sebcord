import express, { Request, Response } from "express";

import { authenticate } from "../middlewares";
import { validateUser } from "../validators/user";

import pool from "../db";
import bcrypt from "bcrypt";
import { secretKey } from "../constants";
import { AuthenticatedResponse } from "../interfaces/MessageResponse";

type DbUser = {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
};

const jwt = require("jsonwebtoken");
const router = express.Router();

// Routes
router.get<{}, AuthenticatedResponse>(
  "/authenticated",
  authenticate,
  (req, res) => {
    res.json({
      authenticated: true,
      user: req.user,
    });
  },
);

router.get("/", authenticate, async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query<DbUser>(
      `SELECT id, username, email, created_at, updated_at
           FROM users
       ORDER BY id`,
    );

    if (!rows.length) return res.status(404).send("No users found.");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).send("Username, email, and password are required.");

  try {
    // Check if the user already exists
    const { rowCount: dup } = await pool.query(
      `SELECT 1 FROM users
          WHERE email    = $1
             OR username = $2
         LIMIT 1`,
      [email, username],
    );
    if (dup)
      return res
        .status(409)
        .send("An account with that e‑mail or username already exists.");

    // Insert the user into db
    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password_hash)
              VALUES ($1, $2, $3)
           RETURNING id, username, email`,
      [username, email, passwordHash],
    );
    const user = rows[0];

    // Send access and refresh tokens
    const accessToken = jwt.sign({ user }, secretKey, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ user }, secretKey, { expiresIn: "1d" });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .header("Authorization", accessToken)
      .status(201)
      .json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send("Email and password are required.");

  try {
    const user = await validateUser(email, password);
    if (!user) return res.status(401).send("Invalid email or password.");

    // Send access and refresh tokens
    const accessToken = jwt.sign({ user }, secretKey, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ user }, secretKey, { expiresIn: "1d" });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hrs,
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 5 * 60 * 1000, // 5 mins,
      })
      .json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
});

router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    return res.status(401).send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(refreshToken, secretKey);
    const accessToken = jwt.sign({ user: decoded.user }, secretKey, {
      expiresIn: "1h",
    });

    res.header("Authorization", accessToken).send(decoded.user);
  } catch (error) {
    return res.status(400).send("Invalid refresh token.");
  }
});

export default router;
