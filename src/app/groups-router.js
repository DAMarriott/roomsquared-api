const express = require("express");
const path = require("path");
const GroupsService = require("./groups-services");
const { requireAuth } = require("../auth/jwt-auth");

const groupsRouter = express.Router();
const jsonBodyParser = express.json();

groupsRouter
  .route("/")
  .get(
    /*requireAuth, */ (req, res, next) => {
      const { groupId } = req.query;
      res.json({ groupId });
    }
  )
  .post(/*requireAuth, */ jsonBodyParser, async (req, res, next) => {
    const { groupId } = req.body;

    try {
      const group = await GroupsService.addGroupId(req.app.get("pg"), groupId);
      res.status(201).json({ ...group });
    } catch (err) {
      next(err);
    }
  });

module.exports = groupsRouter;
