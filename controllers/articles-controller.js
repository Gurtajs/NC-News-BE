const { getArticleData, getAllArticlesData, patchArticleData, getAllArticlesByTopic, postArticleData, paginationArticles, deleteArticleData } = require("../models/articles-models");

function getArticle(req, res, next) {
  const { article_id } = req.params;
  getArticleData(article_id).then((article) => {
    res.status(200).send({ article });
  }).catch(next)
}

function getAllArticles(req, res, next) {
  const {page, limit} = req.query
  const offset = (page-1)*limit
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

function deleteArticle(req, res, next) {
  const {article_id} = req.params
  deleteArticleData(article_id).then(() => 
  {
    res.sendStatus(204)
  }).catch(next)
}

module.exports = { getArticle, getAllArticles, patchArticle, postArticle, deleteArticle};
