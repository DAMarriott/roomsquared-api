const bcrypt = require("bcryptjs");
const xss = require("xss");
const AuthService = require("../auth/auth-services");

const UsersService = {
  hasUserWithUserName(pg, username) {
    return pg("users")
      .where({ username })
      .first()
      .then((user) => !!user);
  },
  insertUser(pg, newUser) {
    return pg
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 3) {
      return "Password must be longer than 3 characters";
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
      groupId: xss(user.groupId),
    };
  },
  getUserFromToken(authHeader) {
    const { id, iat, sub, groupId } = AuthService.decodeJwt(
      authHeader.split(" ")[1]
    );
    return {
      id,
      iat,
      username: sub,
      groupId,
    };
  },
};

module.exports = UsersService;
