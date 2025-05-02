import pool from "../db";
import bcrypt from "bcrypt";

export type UserRow = {
  id: number;
  email: string;
  username: string;
  password_hash: string;
};

export type AuthUser = Omit<UserRow, "password_hash">;

/**
 * Returns the user (minus password_hash) if the credentials match,
 * otherwise `null`.
 */
export async function validateUser(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const { rows } = await pool.query<UserRow>(
    `SELECT id, email, username, password_hash
       FROM users
      WHERE email = $1
      LIMIT 1`,
    [email],
  );

  if (!rows.length) return null;

  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;

  // strip the hash before returning
  const { password_hash, ...safeUser } = user;
  return safeUser;
}
