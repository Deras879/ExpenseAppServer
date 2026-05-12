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
const GET_USER_BY_ID_QUERY = `
  SELECT id, username, email, password
  FROM users
  WHERE id = $1
`;

const USER_UPDATE_PASSWORD_QUERY = `
  UPDATE users
  SET password = $1
  WHERE id = $2
`;

const ALLOWED_PROFILE_FIELDS = ["username", "email"];

const UPDATE_USER_PROFILE_QUERY = (fields) => {
  const entries = Object.entries(fields).filter(([key]) =>
    ALLOWED_PROFILE_FIELDS.includes(key),
  );
  if (entries.length === 0) throw new Error("No valid fields to update");

  const setClauses = entries.map(([key], i) => `${key} = $${i + 1}`).join(", ");
  const values = entries.map(([, val]) => val);

  return {
    query: `UPDATE users SET ${setClauses} WHERE id = $${entries.length + 1} RETURNING id, username, email`,
    values,
  };
};

export default {
  USER_INSERT_QUERY,
  USER_SELECT_BY_EMAIL_QUERY,
  GET_USER_BY_ID_QUERY,
  USER_UPDATE_PASSWORD_QUERY,
  UPDATE_USER_PROFILE_QUERY,
};
