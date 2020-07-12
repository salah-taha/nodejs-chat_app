const { chunk } = require("lodash");

module.exports = function (async, Club, _, Users) {
  return {
    SetRouting: function (router) {
      router.get("/home", this.homePage);
    },
    homePage: function (req, res) {
      async.parallel(
        [
          function (callback) {
            Club.find({}, (err, result) => {
              callback(err, result);
            });
          },
          function (callback) {
            Club.aggregate(
              [
                {
                  $group: {
                    _id: "$country",
                  },
                },
              ],
              (err, newResult) => {
                callback(err, newResult);
              }
            );
          },
          function (callback) {
            Users.findOne({ username: req.user.username })
              .populate("request.userId")
              .exec((err, result) => {
                callback(err, result);
              });
          },
        ],
        (err, results) => {
          const allTeams = results[0];
          const countries = results[1];
          const user = results[2];

          const dataChunk = [];
          const chunkSize = 3;

          for (let i = 0; i < allTeams.length; i += chunkSize) {
            dataChunk.push(allTeams.slice(i, i + chunkSize));
          }

          const sortedCountries = _.sortBy(countries, "_id");

          return res.render("home", {
            title: "Footballkik - salah",
            chunks: dataChunk,
            data: user,
            countries: sortedCountries,
            user: req.user,
          });
        }
      );
    },
  };
};
