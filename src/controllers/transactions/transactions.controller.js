import queries from "./transactions.queries.js";
import { pool } from "../../db.js";

export const getUserTransactions = async (userId) => {
  try {
    const { rows } = await pool.query(queries.GET_USER_TRANSACTIONS, [userId]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

export const createTransaction = async (
  userId,
  amount,
  type,
  title,
  category,
) => {
  try {
    const { rows } = await pool.query(queries.CREATE_TRANSACTION, [
      userId,
      amount,
      type,
      title,
      category,
    ]);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};
