import queries from "./savings_contributions.queries.js";
import { pool } from "../../db.js";

export const getGoalContributions = async (savingGoalId) => {
  const { rows } = await pool.query(queries.GET_GOAL_CONTRIBUTIONS, [
    savingGoalId,
  ]);
  return rows;
};

export const createContribution = async (goalId, amount, note, userId) => {
  const { rows } = await pool.query(queries.CREATE_CONTRIBUTION, [
    goalId,
    amount,
    note,
    userId,
  ]);
  return rows[0];
};
