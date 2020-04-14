const express = require("express");
const path = require("path");
const PurchaseService = require("./purchase-services");
const { requireAuth } = require("../auth/jwt-auth");
const AuthService = require("../auth/auth-services");
const UsersService = require("./users-services");

const purchaseRouter = express.Router();
const jsonBodyParser = express.json();

purchaseRouter
  .route("/")
  .get(
    /*requireAuth, */ (req, res, next) => {
      const { groupId } = req.body;
      PurchaseService.getAllById(req.app.get("pg"), groupId).then(
        (purchases) => {
          return res.status(201);
        }
      );
    }
  )
  .post(/*requireAuth, */ jsonBodyParser, async (req, res, next) => {
    const { item, price } = req.body;

    const { username, groupId } = UsersService.getUserFromToken(
      req.header("authorization")
    );

    // const authHeader = req.header("authorization");

    const newPurchase = { username, item, price, groupId };

    for (const [key, value] of Object.entries(newPurchase))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });

    try {
      const purchase = await PurchaseService.insertPurchase(
        req.app.get("pg"),
        newPurchase
      ).then((purchase) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${purchase.id}`));
        /*.json(PurchaseService.serializePurchase(purchase)); */
      });
      res.status(201).json({ ...purchase });
    } catch (err) {
      next(err);
    }
  });

purchaseRouter
  .route("/:id")
  .all((req, res, next) => {
    PurchaseService.getAllById(req.app.get("pg"), req.params.id)
      .then((id) => {
        if (!id) {
          return res.status(404).json({
            error: { message: `Article doesn't exist` },
          });
        }
        res.id = id;
        next();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    PurchaseService.deletePurchase(req.app.get("pg"), req.params.id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = purchaseRouter;
