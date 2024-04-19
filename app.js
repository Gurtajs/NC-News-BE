const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");
const description = require("./endpoints.json");
const {
  getArticle,
  getAllArticles,
  patchArticle,
} = require("./controllers/articles-controller");
const {
  getComments,
  postComment,
  deleteComment,
} = require("./controllers/comments-controller");

const {getUsers} = require("./controllers/users-controller")

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", (req, res, next) => {
  res.status(200).send({ description });
});

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.get('/api/users', getUsers)

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ message: "Article not found" });
  }
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } 
  if (err.code === '22P02') {
    res.status(400).send({ message: "Bad request"})
  }
});

module.exports = app;
