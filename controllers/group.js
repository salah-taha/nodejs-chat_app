module.exports = function (Users, async) {
  return {
    SetRouting: function (router) {
      router.get("/group/:name", this.groupPage);
      router.post("/group/:name", this.groupPostPage);
    },
    groupPage: function (req, res) {
      const name = req.params.name;

      async.parallel(
        [
          function (callback) {
            Users.findOne({ username: req.user.username })
              .populate("request.userId")
              .exec((err, result) => {
                callback(err, result);
              });
          },
        ],
        (err, results) => {
          const user = results[0];

          res.render("groupchat/group", {
            title: "Footballkik - Group",
            groupName: name,
            user: req.user,
            data: user,
          });
        }
      );
    },
    groupPostPage: function (req, res) {
      async.parallel(
        [
          function (callback) {
            if (req.body.receiverName) {
              Users.updateOne(
                {
                  username: req.body.receiverName,
                  "request.userId": { $ne: req.user._id },
                  "friendsList.friendId": { $ne: req.user._id },
                },
                {
                  $push: {
                    request: {
                      userId: req.user._id,
                      username: req.user.username,
                    },
                  },
                  $inc: { totalRequest: 1 },
                },
                (err, count) => {
                  callback(err, count);
                }
              );
            }
          },
          function (callback) {
            if (req.body.receiverName) {
              Users.updateOne(
                {
                  username: req.user.username,
                  "sentRequest.username": { $ne: req.body.receiverName },
                },
                {
                  $push: {
                    sentRequest: {
                      username: req.body.receiverName,
                    },
                  },
                },
                (err, count) => {
                  callback(err, count);
                }
              );
            }
          },
        ],
        (err, results) => {
          res.redirect("/group/" + req.params.name);
        }
      );
      async.parallel(
        [
          function (callback) {
            if (req.body.senderId) {
              Users.updateOne(
                {
                  _id: req.user._id,
                  "friendsList.friendId": { $ne: req.body.senderId },
                },
                {
                  $push: {
                    friendsList: {
                      friendId: req.body.senderId,
                      friendName: req.body.senderName,
                    },
                  },
                  $pull: {
                    request: {
                      userId: req.body.senderId,
                      username: req.body.senderName,
                    },
                  },
                  $inc: {
                    totalRequest: -1,
                  },
                },
                (err, count) => {
                  callback(err, count);
                }
              );
            }
          },

          function (callback) {
            if (req.body.senderId) {
              Users.updateOne(
                {
                  _id: req.body.senderId,
                  "friendsList.friendId": { $ne: req.user._id },
                },
                {
                  $push: {
                    friendsList: {
                      friendId: req.user._id,
                      friendName: req.user.username,
                    },
                  },
                  $pull: {
                    sentRequest: {
                      username: req.user.username,
                    },
                  },
                },
                (err, count) => {
                  callback(err, count);
                }
              );
            }
          },

          function (callback) {
            if (req.body.user_id) {
              Users.updateOne(
                {
                  _id: req.user._id,
                  "request.userId": { $eq: req.body.user_id },
                },
                {
                  $pull: {
                    request: {
                      userId: req.body.user_id,
                    },
                  },
                  $inc: { totalRequest: -1 },
                },
                (err, count) => {
                  callback(err, count);
                }
              );
            }
          },

          function (callback) {
            if (req.body.user_id) {
              console.log("'" + req.body.user_id + "'");
              Users.updateOne(
                {
                  _id: req.body.user_id,
                  "sentRequest.username": { $eq: req.user.username },
                },
                {
                  $pull: {
                    sentRequest: {
                      username: req.user.username,
                    },
                  },
                },
                (err, count) => {
                  callback(err, count);
                }
              );
            }
          },
        ],

        (err, results) => {
          res.redirect("/group/" + req.params.name);
        }
      );
    },
  };
};
