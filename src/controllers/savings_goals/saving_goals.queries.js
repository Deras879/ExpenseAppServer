const GET_USER_SAVING_GOALS = `
  SELECT 
    *
  FROM savings_goals
  WHERE user_id = $1
`;

const CREATE_SAVING_GOAL = `
  INSERT INTO savings_goals (user_id, name, target_amount, current_amount, deadline, icon, color, status, created_at, updated_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *
`;

// Mapeo camelCase -> columna en BD para campos que se asignan directamente.
const UPDATABLE_FIELDS = {
  name: "name",
  targetAmount: "target_amount",
  deadline: "deadline",
  icon: "icon",
  color: "color",
  status: "status",
};

/**
 * Construye dinámicamente la query UPDATE solo con los campos provistos.
 * - Si `fields.currentAmount` viene definido, se trata como DELTA y se hace
 *   current_amount = current_amount + $n (puede ser positivo o negativo).
 * - Cualquier otro campo en UPDATABLE_FIELDS se asigna directo.
 * - updated_at se actualiza siempre que haya algún cambio.
 *
 * @param {object} fields - objeto con los campos a actualizar (camelCase)
 * @returns {{ text: string, values: any[] } | null}
 */
const buildUpdateSavingGoalQuery = (fields) => {
  const setClauses = [];
  const values = [];
  let i = 1;

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;

    if (key === "currentAmount") {
      setClauses.push(`current_amount = current_amount + $${i++}`);
      values.push(value);
      continue;
    }

    const column = UPDATABLE_FIELDS[key];
    if (!column) continue;
    setClauses.push(`${column} = $${i++}`);
    values.push(value);
  }

  if (setClauses.length === 0) return null;

  setClauses.push(`updated_at = $${i++}`);
  values.push(new Date());

  const text = `
    UPDATE savings_goals
    SET ${setClauses.join(", ")}
    WHERE id = $${i++} AND user_id = $${i++}
    RETURNING *
  `;

  return { text, values };
};

const DELETE_SAVING_GOAL = `
  DELETE FROM savings_goals
  WHERE id = $1 AND user_id = $2
`;
const GET_SAVING_GOAL_BY_ID = `
  SELECT *
  FROM savings_goals
  WHERE id = $1 AND user_id = $2
`;
export default {
  GET_USER_SAVING_GOALS,
  CREATE_SAVING_GOAL,
  buildUpdateSavingGoalQuery,
  DELETE_SAVING_GOAL,
  GET_SAVING_GOAL_BY_ID,
};
