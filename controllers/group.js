module.exports = function (Club) {
  return {
    SetRouting: function (router) {
      router.get("/group/:name", this.groupPage);
    },
    groupPage: function (req, res) {
      const name = req.params.name;
      res.render("groupchat/group", {
        title: "Footballkik - Group",
        groupName: name,
        user: req.user,
      });
    },
  };
};
