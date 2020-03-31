const { CONNECTION_STRING } = require("../config/config");

var pg = require("knex")({
  client: "pg",
  connection: CONNECTION_STRING,
  searchPath: ["public"]
});

async function createUser(username, password, groupId) {
  await pg("users")
    .insert({ username, password, groupId })
    .returning("*");
}

async function checkUserSignIn(username) {
  await pg("users").where({
    username: username
  });
}

async function selectHash(username) {
  await pg("users")
    .where({
      username: username
    })
    .select("password");
}

module.exports = {
  createUser,
  checkUserSignIn,
  selectHash
};
