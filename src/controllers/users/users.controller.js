import queries from "./users.queries.js";
import { pool } from "../../db.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const registerUser = async (username, email, password) => {
  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const { rows } = await pool.query(queries.USER_INSERT_QUERY, [
      username,
      email,
      passwordHash,
    ]);
    return rows[0];
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const { rows } = await pool.query(queries.USER_SELECT_BY_EMAIL_QUERY, [
      email,
    ]);
    if (rows.length === 0) {
      throw new Error("User not found");
    }
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const { password: _pw, ...safeUser } = user;
    return safeUser;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const { rows } = await pool.query(queries.GET_USER_BY_ID_QUERY, [id]);
    if (rows.length === 0) {
      throw new Error("User not found");
    }
    return rows[0];
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
};

export const changePassword = async (userId, newPassword) => {
  try {
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    await pool.query(queries.USER_UPDATE_PASSWORD_QUERY, [
      passwordHash,
      userId,
    ]);
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const { rows } = await pool.query(queries.USER_SELECT_BY_EMAIL_QUERY, [
      email,
    ]);
    return rows[0];
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, fields) => {
  try {
    const { query, values } = queries.UPDATE_USER_PROFILE_QUERY(fields);
    const { rows } = await pool.query(query, [...values, userId]);
    return rows[0];
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
