const bcrypt = require("bcryptjs");
const xss = require("xss");

const UsersService = {
  hasUserWithUserName(pg, username) {
    return pg("users")
      .where({ username })
      .first()
      .then(user => !!user);
  },
  insertUser(pg, newUser) {
    return pg
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 6) {
      return "Password be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      full_name: xss(user.username),
      groupId: xss(user.groupId)
    };
  }
};

module.exports = UsersService;
