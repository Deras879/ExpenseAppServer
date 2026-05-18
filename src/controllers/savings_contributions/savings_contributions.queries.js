const GET_GOAL_CONTRIBUTIONS = `
  SELECT 
    id, amount, created_at, note
    FROM savings_contributions
    WHERE goal_id = $1
    ORDER BY created_at DESC
`;

const CREATE_CONTRIBUTION = `
  INSERT INTO savings_contributions (goal_id, amount, note, user_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *
`;

export default {
  GET_GOAL_CONTRIBUTIONS,
  CREATE_CONTRIBUTION,
};
