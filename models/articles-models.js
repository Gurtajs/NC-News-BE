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

function getAllArticlesData(sort_by = 'created_at', order='desc') {
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`).then(
        (result) => {
        return result.rows
    })
}

module.exports = { getArticleData, getAllArticlesData };
