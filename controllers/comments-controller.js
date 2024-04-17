const {
  getCommentsData,
  postCommentData,
  addUsernameData,
  deleteCommentData,
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

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  deleteCommentData(comment_id)
    .then((body) => {
      res.status(204).send({ body });
    })
    .catch(next);
}

module.exports = { getComments, postComment, deleteComment };
