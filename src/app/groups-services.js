const xss = require("xss");

const GroupsService = {
  getById(pg, groupId) {
    console.log(groupId);
    return pg
      .from("groups")
      .select("*")
      .where("groupId", groupId);
  },

  addGroupId(pg, groupId) {
    return pg
      .insert({ groupId })
      .into("groups")
      .returning("*")
      .then(([group]) => group);
  }
};

module.exports = GroupsService;
