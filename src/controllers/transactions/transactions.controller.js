import queries from "./transactions.queries.js";
import { pool } from "../../db.js";

export const getUserTransactions = async (
  userId,
  { page = 1, limit = 10, title, category } = {},
) => {
  try {
    const offset = (page - 1) * limit;
    const query = queries.GET_USER_TRANSACTIONS({ title, category });

    const params = [userId];
    if (title) params.push(`%${title}%`);
    if (category) params.push(category);
    params.push(Number(limit), Number(offset));

    const { rows } = await pool.query(query, params);
    return {
      data: rows,
      total: rows.length > 0 ? parseInt(rows[0].total_count) : 0,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createTransaction = async (
  userId,
  amount,
  type,
  title,
  category,
  date,
) => {
  try {
    const { rows } = await pool.query(queries.CREATE_TRANSACTION, [
      userId,
      amount,
      type,
      title,
      category,
      date,
    ]);
    return rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getMetrics = async (userId) => {
  try {
    const { rows } = await pool.query(queries.GET_METRICS, [userId]);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getExpensesByCategory = async (userId) => {
  try {
    const { rows } = await pool.query(queries.GET_EXPENSES_BY_CATEGORY, [
      userId,
    ]);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getExpensesVsIncomeSixMonth = async (userId) => {
  try {
    const { rows } = await pool.query(queries.GET_EXPENSES_VS_INCOME_SIXMONTH, [
      userId,
    ]);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLast7DaysExpenses = async (userId) => {
  try {
    const { rows } = await pool.query(queries.GET_LAST7_DAYS_EXPENSES, [
      userId,
    ]);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
