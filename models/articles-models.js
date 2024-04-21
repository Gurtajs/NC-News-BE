const db = require("../db/connection");

function getArticleData(article_id) {
  return db
    .query("SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, articles.body, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id", [article_id])
    .then((article) => {
      const articleRow = article.rows[0];
      if (!articleRow) {
        return Promise.reject({
          status: 404,
          message: "Not found",
        });
      }
      return articleRow;
    });
}

function getAllArticlesByTopic(topic, sort_by = "created_at", order = "desc") {
  if (/\d/.test(topic)) {
    return Promise.reject({
      status:400,
      message: "Bad request"
    })
  }
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE topic = $1 GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`,
      [topic]
    )
    .then((articles) => {
      const articlesRows = articles.rows
      if (articlesRows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Not found"
        })
      } else {
        return articlesRows;
      }
    });
}

function getAllArticlesData(sort_by = "created_at", order = "desc") {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`
    )
    .then((result) => {
      return result.rows;
    });
}

function patchArticleData(article_id, inc_votes) {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      message: "Bad request: property not modifiable",
    });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
      return article.rows[0];
    });
}

module.exports = {
  getArticleData,
  getAllArticlesData,
  patchArticleData,
  getAllArticlesByTopic,
};
