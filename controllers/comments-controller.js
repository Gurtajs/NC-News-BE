const {
  getCommentsData,
  postCommentData,
  addUsernameData,
} = require("../models/comments-models");

function getComments(req, res, next) {
  const { article_id } = req.params;
  getCommentsData(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
}

function postComment(req, res, next) {
  const comment = req.body;
  const { username } = comment;
  const { article_id } = req.params;
  addUsernameData(username);
  postCommentData(comment, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}

module.exports = { getComments, postComment };
