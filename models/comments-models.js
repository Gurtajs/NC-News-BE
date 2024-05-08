const db = require("../db/connection");
const { articleData } = require("../db/data/development-data");

function getCommentsData(article_id, sort_by = "created_at", order = "desc") {
  if (article_id > articleData.length) {
    return Promise.reject({ status: 404, message: "Article not found" });
  }
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY ${sort_by} ${order};`,
      [article_id]
    )
    .then((comments) => {
      return comments.rows;
    });
}

function postCommentData(comment, article_id) {
  const { username, body } = comment;
  const keysArray = Object.keys(comment);
  if (
    !keysArray.includes(username) &&
    !keysArray.includes(body) &&
    keysArray.length !== 2
  ) {
    return Promise.reject({
      status: 400,
      message: "Bad request: incomplete body",
    });
  } else {
    return db
      .query(
        `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
        [username, body, article_id]
      )
      .then((comment) => {
        return comment.rows[0];
      });
  }
}

function deleteCommentData(comment_id) {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({ status: 404, message: "Comment not found" });
      }
    });
}

function patchCommentData(comment_id, inc_votes) {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      message: "Bad request: property not modifiable",
    });
  }
  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *",
      [inc_votes, comment_id]
    )
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
      return comment.rows[0];
    });
}

module.exports = {
  getCommentsData,
  postCommentData,
  deleteCommentData,
  patchCommentData,
};
