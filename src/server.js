require("dotenv").config();

const knex = require("knex");
const app = require("./app/app");
const { PORT, CONNECTION_STRING } = require("./config/config");

//Postgres variable return
const pg = knex({
  client: "pg",
  connection: CONNECTION_STRING
});

app.set("pg", pg);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
