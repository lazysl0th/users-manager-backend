import { pool } from '../app.js';
import bcrypt from 'bcryptjs';
import Unauthorized from '../errors/unauthorized.js';
import Conflict from '../errors/conflict-err.js';
import NotFoundError from '../errors/not-found-err.js';
import Forbidden from '../errors/forbidden-err.js';
import constatns from '../constatns.js';
const { CONFLICT, FORBIDDEN, UNAUTHORIZED, NOT_FOUND, NOT_FOUND_RECORDS } = constatns;

export const insertUserQuery = async (name, email, password, verifyToken) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await pool.query(
      'INSERT INTO users (name, email, password, last_login, verify_token) VALUES ($1, $2, $3, NOW()::timestamptz, $4) RETURNING id, name, email, last_login',
      [name, email, hash, verifyToken]);
    return user.rows[0];
  } catch (e) {
    console.log(e)
    if (e.code == '23505') throw new Conflict(CONFLICT.text);
  }
}

export const deleteUserByCredentialsQuery = async (id) => {
  const user = await pool.query(
    'DELETE FROM users WHERE id = ANY($1::int[]) RETURNING id',
    [id]
  )
  if (user.rows.length == 0) throw new Forbidden(FORBIDDEN.text);
  return user.rows;
}

export const deleteUnverifiedUserQuery = async () => {
  const users = await pool.query("DELETE FROM users WHERE status = 'Unverified' RETURNING id")
  if (users.rows.length == 0) throw new NotFoundError(NOT_FOUND_RECORDS.text);
  return users.rows;
}

export const selectUserByCredentialsQuery = async (email, password) => {
  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
    [email])
    const matched = await bcrypt.compare(password, user.rows[0].password);
    if (matched) return user.rows[0];
  } catch (e) {
    return e
  }
}

export const updateLastLoginQuery = async (id) => {
  const lastLogin = await pool.query(
    'UPDATE users SET last_login = NOW()::timestamptz WHERE id = $1 RETURNING last_login',
    [id])
  if (!lastLogin.rows[0]) throw new Unauthorized(UNAUTHORIZED.text)
  return lastLogin.rows[0];
}

export const selectUserByIdQuery = async (id) => {
  const user = await pool.query(
    "SELECT id, name, email, status, last_login, verify_token FROM users WHERE id = ANY($1::int[])",
    [Array.isArray(id) ? id : [id]])
  if (user.rows.length == 0) throw new NotFoundError(NOT_FOUND.text);
  return user.rows;
}

export const updateBlockStatusQuery = async (id) => {
  const user = await pool.query(
    `UPDATE users SET status = 'Blocked' WHERE id = ANY($1::int[]) RETURNING id, status`,
    [id])
  return user.rows;
}

export const updateActiveStatusQuery = async (id) => {
  const user = await pool.query(
    `UPDATE users SET status = 'Active' WHERE id = ANY($1::int[]) RETURNING id, status`,
    [Array.isArray(id) ? id : [id]])
  return user.rows;
}

export const updateUnverifyStatusQuery = async (id) => {
  const user = await pool.query(
    `UPDATE users SET status = 'Unverified' WHERE id = ANY($1::int[]) RETURNING id, status`,
    [Array.isArray(id) ? id : [id]])
  return user.rows;
}

export const selectAllUsersQuery = async () => {
  const users = await pool.query(
    'SELECT id, name, email, status, last_login FROM users'
  )
  return users.rows;
}

export const selectUserByVerifyTokenQuery = async (verifyToken) => {
  const user = await pool.query(
    'SELECT id, name, email, status FROM users WHERE verify_token = $1',
    [verifyToken]
  )
  if (user.rows.length == 0) throw new NotFoundError(NOT_FOUND.text); 
  return user.rows[0];
}

export const insertVerifyTokenQuery = async (verifyToken, userId) => {
  return await pool.query(
    `UPDATE users SET verify_token = $1 WHERE id = $2 RETURNING id, verify_token`,
    [verifyToken, userId]
  )
}

export const insertResetTokenQuery = async (resetToken, userId) => {
  return await pool.query(
    `UPDATE users SET reset_token = $1 WHERE id = $2 RETURNING id, reset_token`,
    [resetToken, userId]
  )
}

export const selectUserByEmail = async (email) => {
  const user = await pool.query(
    'SELECT id, name, email FROM users WHERE email = $1',
    [email]
  )
  if (user.rows.length == 0) throw new NotFoundError(NOT_FOUND.text); 
  return user.rows[0];
}

export const insertNewPasswordQuery = async (password, verifyToken) => {
  const hash = await bcrypt.hash(password, 10);
  const user =  await pool.query(
    `UPDATE users SET password = $1 WHERE verify_token = $2 RETURNING id`,
    [hash, verifyToken]
  )
  return user.rows[0];
}