const db = require("../db/connection");

function getArticleData(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((article) => {
      const articleRow = article.rows[0];
      if(!articleRow) {
          return Promise.reject({
              status: 404,
              message: 'Not found'
          })
      }
      return articleRow
    });
}

module.exports = { getArticleData };
