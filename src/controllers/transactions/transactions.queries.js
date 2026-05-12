const GET_USER_TRANSACTIONS = ({ title, category } = {}) => {
  let paramIndex = 1;
  let filters = "";

  if (title) {
    paramIndex++;
    filters += ` AND title ILIKE $${paramIndex}`;
  }

  if (category) {
    paramIndex++;
    filters += ` AND category = $${paramIndex}`;
  }

  return `
    SELECT *, COUNT(*) OVER() AS total_count
    FROM transactions
    WHERE userid = $1${filters}
    ORDER BY date DESC
    LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}
  `;
};

const CREATE_TRANSACTION = `
  INSERT INTO transactions (userid, amount, type, title, category, date)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *
`;

const GET_METRICS = `
  SELECT 
    type, COUNT(*) as count, SUM(amount) as total
  FROM 
    transactions
  WHERE 
    userid = $1
    AND date >= date_trunc('month', CURRENT_DATE)
    AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'
  
  GROUP BY 
    type
`;

const GET_EXPENSES_BY_CATEGORY = `
  SELECT 
    category, SUM(amount) as total
  FROM 
    transactions
  WHERE 
    userid = $1
    AND type = 'expense'
    AND date >= date_trunc('month', CURRENT_DATE)
    AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'
  GROUP BY 
    category
`;

const GET_EXPENSES_VS_INCOME_SIXMONTH = `
  SELECT 
    date_trunc('month', date) as month, 
    type, 
    SUM(amount) as total
  FROM 
    transactions
  WHERE 
    userid = $1
    AND date >= date_trunc('month', CURRENT_DATE) - interval '5 month'
    AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'
  GROUP BY 
    month, type
  ORDER BY 
    month DESC
`;

const GET_LAST7_DAYS_EXPENSES = `
  SELECT 
    date_trunc('day', date) as day, 
    SUM(amount) as total
  FROM 
    transactions
  WHERE 
    userid = $1
    AND type = 'expense'
    AND date >= CURRENT_DATE - interval '7 day'
  GROUP BY 
    day
  ORDER BY 
    day DESC
`;

export default {
  GET_USER_TRANSACTIONS,
  CREATE_TRANSACTION,
  GET_METRICS,
  GET_EXPENSES_BY_CATEGORY,
  GET_EXPENSES_VS_INCOME_SIXMONTH,
  GET_LAST7_DAYS_EXPENSES,
};
