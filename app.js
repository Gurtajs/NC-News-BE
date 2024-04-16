const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");
const description = require("./endpoints.json");
const { getArticle, getAllArticles } = require("./controllers/articles-controller");


app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", (req, res, next) => {
  res.status(200).send({ description });
});

app.get("/api/articles/:article_id", getArticle);

app.get('/api/articles', getAllArticles)



app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({message: err.message})
    } else {
        res.status(400).send({message: 'Bad request'})
    }
})

module.exports = app;
