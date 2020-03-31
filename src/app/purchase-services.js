const xss = require("xss");

const PurchaseService = {
  getAllById(pg, groupId) {
    return pg
      .from("purchases")
      .select("*")
      .where("groupId", groupId);
  },

  addPurchase(pg, newPurchase) {
    return pg
      .insert(newPurchase)
      .into("purchases")
      .returning("*")
      .then(([purchase]) => purchase)
      .then(purchase => PurchaseService.getById(pg, purchase.groupId));
  },

  deletePurchase(pg, id) {
    return knex("shopping_list")
      .where({ id })
      .delete();
  },

  serializePurchase(purchase) {
    const { user } = purchase;
    return {
      id: purchase.id,
      item: xss(purchase.item),
      cost: purchase.cost,
      date_created: new Date(purchase.date_created),
      user: {
        id: user.id,
        user_name: user.user_name,
        full_name: user.full_name,
        nickname: user.nickname,
        date_created: new Date(user.date_created)
      }
    };
  }
};

module.exports = PurchaseService;
