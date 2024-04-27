const { getArticleData, getAllArticlesData, patchArticleData, getAllArticlesByTopic, postArticleData } = require("../models/articles-models");

function getArticle(req, res, next) {
  const { article_id } = req.params;
  getArticleData(article_id).then((article) => {
    res.status(200).send({ article });
  }).catch(next)
}

function getAllArticles(req, res, next) {
  const {topic} = req.query
  const {sort_by, order_by} = req.query
  if (topic) {
    getAllArticlesByTopic(topic, sort_by, order_by).then((articles) => {
      res.status(200).send({articles})
    }).catch(next)
  } else {
    getAllArticlesData(sort_by, order_by).then((articles) => {
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

function postArticle(req, res, next) {
  const article = req.body
  postArticleData(article).then((article) => {

    res.status(201).send({article})
  }).catch(next)
}

module.exports = { getArticle, getAllArticles, patchArticle, postArticle};
