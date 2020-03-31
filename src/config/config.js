module.exports = {
  PORT: process.env.PORT || 8000,
  CONNECTION_STRING: process.env.PG_CONNECTION_STRING,
  JWT_SECRET: "dope",
  CLIENT_ORIGIN: "https://localhost:3000"
};
