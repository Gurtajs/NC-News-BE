const db = require("../db/connection");
const { articleData } = require("../db/data/test-data");


function getCommentsData(article_id, sort_by = "created_at", order = "desc") {
  if(article_id>articleData.length) {
    return Promise.reject({status: 404, message:"Article not found"})
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

module.exports = {
  getCommentsData,
  postCommentData,
  deleteCommentData,
};
