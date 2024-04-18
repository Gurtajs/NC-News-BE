const { getArticleData, getAllArticlesData, patchArticleData, getAllArticlesByTopic } = require("../models/articles-models");

function getArticle(req, res, next) {
  const { article_id } = req.params;
  getArticleData(article_id).then((article) => {
    res.status(200).send({ article });
  }).catch(next)
}

function getAllArticles(req, res, next) {
  const {topic} = req.query
  if (topic) {
    getAllArticlesByTopic(topic).then((articles) => {
      res.status(200).send({articles})
    }).catch(next)
  } else {
    getAllArticlesData().then((articles) => {
      res.status(200).send({articles})
    }).catch(next)
  }
}

function patchArticle(req, res, next) {
  const {article_id} = req.params
  const {inc_votes} = req.body
  patchArticleData(article_id, inc_votes).then((article) => {
    res.status(200).send({article})
  }).catch(next)
}


module.exports = { getArticle, getAllArticles, patchArticle};
