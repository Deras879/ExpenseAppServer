const GET_USER_TRANSACTIONS = `
  SELECT 
    *
  FROM 
    transactions 
  WHERE 
userid = $1
`;

const CREATE_TRANSACTION = `
  INSERT INTO transactions (userid, amount, type, title, category)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *
`;

export default { GET_USER_TRANSACTIONS, CREATE_TRANSACTION };
