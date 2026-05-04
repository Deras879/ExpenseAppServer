const USER_INSERT_QUERY = `
  INSERT INTO users (username, email, password)
  VALUES ($1, $2, $3)
  RETURNING id, username, email
`;

const USER_SELECT_BY_EMAIL_QUERY = `
  SELECT id, username, email, password
  FROM users
  WHERE email = $1
`;

export default { USER_INSERT_QUERY, USER_SELECT_BY_EMAIL_QUERY };
