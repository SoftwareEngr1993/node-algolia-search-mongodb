const async = require("async"),
  algoliaClient = require("../config/config"),
  userIndex = algoliaClient.initIndex("UserIndex"),
  ArticleIndex = algoliaClient.initIndex("ArticleIndex");

exports.searchItems = (req, res) => {
  let search = req.body.search,
    totalSearchResult = {};
  async.parallel(
    [
      callback => {
        ArticleIndex.search(search)
          .then(data => {
            totalSearchResult.Articles = data.hits;
            callback();
          })
          .catch(error => {
            callback(error);
          });
      },
      callback => {
        userIndex
          .search(search)
          .then(data => {
            totalSearchResult.Users = data.hits;
            callback();
          })
          .catch(error => {
            callback(error);
          });
      }
    ],
    (err, results) => {
      if (err) {
        res.json({ success: false, msg: "Error in search try agian..", err });
      } else {
        res.json({
          success: true,
          msg: "users and articles get...",
          data: totalSearchResult
        });
      }
    }
  );
};
