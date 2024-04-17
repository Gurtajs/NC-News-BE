const db = require("../db/connection");

function getCommentsData(article_id, sort_by = "created_at", order = "desc") {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY ${sort_by} ${order};`,
      [article_id]
    )
    .then((comments) => {
      if (comments.rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article not found" });
      }
      return comments.rows;
    });
}

function addUsernameData(username, name = "Gurtajs") {
  return db.query(
    `INSERT INTO users (username, name) VALUES ($1, $2) RETURNING *`,
    [username, name]
  );
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
      message: "Bad request: non-existent fields passed in",
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

module.exports = { getCommentsData, addUsernameData, postCommentData };
