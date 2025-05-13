import express from "express";
import pool from "../db";
import { authenticate } from "../middlewares";

const router = express.Router();

// Send a friend-request
router.post("/requests/:userId", authenticate, async (req, res) => {
  const from = +req.user!.id;
  const to = +req.params.userId;
  if (from === to) return res.status(400).send("Can't friend yourself.");

  console.log(from, to, from === to, typeof from, typeof to);

  await pool.query(
    `INSERT INTO friend_requests(requester_id, requested_id)
       VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
    [from, to],
  );
  res.sendStatus(201);
});

//  List incoming requests
router.get("/requests", authenticate, async (req, res) => {
  const user = req.user!.id;
  const { rows } = await pool.query(
    `SELECT u.id, u.username, fr.created_at
         FROM friend_requests fr
         JOIN users u ON u.id = fr.requester_id
        WHERE fr.requested_id=$1
          AND fr.status='pending'`,
    [user],
  );
  res.json(rows);
});

// List outgoing requests
router.get("/requests/sent", authenticate, async (req, res) => {
  const user = req.user!.id;
  const { rows } = await pool.query(
    `SELECT
        u.id,
        u.username,
        fr.created_at AS requested_at
        FROM friend_requests fr
        JOIN users u
        ON u.id = fr.requested_id
        WHERE fr.requester_id = $1
        AND fr.status = 'pending'
        ORDER BY fr.created_at DESC;
    `,
    [user],
  );
  res.json(rows);
});

// Accept a request
router.post("/requests/accept/:userId", authenticate, async (req, res) => {
  const me = req.user!.id;
  const them = +req.params.userId;
  if (me === them)
    return res.status(400).send("Can't accept your own request.");

  await pool.query(
    `UPDATE friend_requests
          SET status='accepted', updated_at=NOW()
        WHERE requester_id=$1
          AND requested_id=$2`,
    [them, me],
  );
  res.sendStatus(200);
});

// List your friends
router.get("/", authenticate, async (req, res) => {
  const me = req.user!.id;
  const { rows } = await pool.query(
    `SELECT u.id, u.username
         FROM friend_requests fr
         JOIN users u
           ON (u.id = fr.requester_id AND fr.requested_id = $1)
            OR (u.id = fr.requested_id AND fr.requester_id = $1)
        WHERE fr.status = 'accepted'`,
    [me],
  );
  res.json(rows);
});

// Unfriend / cancel request
router.delete("/:id", authenticate, async (req, res) => {
  const me = req.user!.id;
  const them = +req.params.id;
  await pool.query(
    `DELETE FROM friend_requests
         WHERE (requester_id=$1 AND requested_id=$2)
            OR (requester_id=$2 AND requested_id=$1)`,
    [me, them],
  );
  res.sendStatus(204);
});

export default router;
