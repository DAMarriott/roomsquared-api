const express = require("express");
const AuthService = require("../auth/auth-services");

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter.post("/", jsonBodyParser, (req, res, next) => {
  const { username, password } = req.body;
  const loginUser = { username, password };

  if (!username) {
    return res.status(400).send("username   required");
  }
  if (!password) {
    return res.status(400).send("password required");
  }

  AuthService.getUserWithUserName(req.app.get("pg"), loginUser.username)
    .then((pgUser) => {
      if (!pgUser)
        return res.status(401).json({
          error: "Incorrect username or password",
        });

      return AuthService.comparePasswords(
        loginUser.password,
        pgUser.password
      ).then((compareMatch) => {
        if (!compareMatch)
          return res.status(401).json({
            error: "Incorrect username or password",
          });

        const sub = pgUser.username;
        const payload = { id: pgUser.id, groupId: pgUser.groupId };
        res.send({
          authToken: AuthService.createJwt(sub, payload),
        });
      });
    })
    .catch(next);
});

module.exports = authRouter;
