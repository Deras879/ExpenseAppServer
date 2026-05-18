import queries from "./saving_goals.queries.js";
import { pool } from "../../db.js";

export const getUserSavingGoals = async (userId) => {
  const { rows } = await pool.query(queries.GET_USER_SAVING_GOALS, [userId]);
  return rows;
};

export const createSavingGoal = async (
  userId,
  name,
  targetAmount,
  currentAmount,
  deadline,
  icon,
  color,
) => {
  const createdAt = new Date();
  const updatedAt = new Date();
  const { rows } = await pool.query(queries.CREATE_SAVING_GOAL, [
    userId,
    name,
    targetAmount,
    currentAmount,
    deadline,
    icon,
    color,
    "active",
    createdAt,
    updatedAt,
  ]);
  return rows[0];
};

export const updateSavingGoal = async (goalId, userId, fields) => {
  const query = queries.buildUpdateSavingGoalQuery(fields);
  if (!query) return null; // no hay nada que actualizar

  const { rows } = await pool.query(query.text, [
    ...query.values,
    goalId,
    userId,
  ]);
  return rows[0];
};

export const deleteSavingGoal = async (goalId, userId) => {
  await pool.query(queries.DELETE_SAVING_GOAL, [goalId, userId]);
};

export const getSavingGoalById = async (goalId, userId) => {
  const { rows } = await pool.query(queries.GET_SAVING_GOAL_BY_ID, [
    goalId,
    userId,
  ]);
  return rows[0];
};
