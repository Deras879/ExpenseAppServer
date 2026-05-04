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
    return user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};
