const express = require("express");
const path = require("path");
const PurchaseService = require("./purchase-services");
const { requireAuth } = require("../auth/jwt-auth");

const purchaseRouter = express.Router();
const jsonBodyParser = express.json();

purchaseRouter
  .route("/")
  .get(
    /*requireAuth, */ (req, res, next) => {
      res.json(req.user);
    }
  )
  .post(/*requireAuth, */ jsonBodyParser, (req, res, next) => {
    const { username, item, price, groupID } = req.body;
    const newPurchase = { username, item, price, groupID };

    for (const [key, value] of Object.entries(newPurchase))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    newPurchase.user_id = req.user.id;

    PurchaseService.insertPurchase(req.app.get("pg"), newPurchase)
      .then(purchase => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${purchase.id}`))
          .json(PurchaseService.serializeComment(purchase));
      })
      .catch(next);
  });

purchaseRouter
  .route("/:id")
  .all((req, res, next) => {
    PurchaseService.getAllById(req.app.get("pg"), req.params.id)
      .then(id => {
        if (!id) {
          return res.status(404).json({
            error: { message: `Article doesn't exist` }
          });
        }
        res.id = id;
        next();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    PurchaseService.deletePurchase(req.app.get("pg"), req.params.id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = purchaseRouter;
