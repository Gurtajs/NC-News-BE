const { getArticleData, getAllArticlesData } = require("../models/articles-models");

function getArticle(req, res, next) {
  const { article_id } = req.params;
  getArticleData(article_id).then((article) => {
    res.status(200).send({ article });
  }).catch(next)
}

function getAllArticles(req, res, next) {
	getAllArticlesData().then((articles) => {
		res.status(200).send({articles})
	}).catch(next)
}


module.exports = { getArticle, getAllArticles };
