const { getArticle, getAllArticles, patchArticle, postArticle, pagination, deleteArticle} = require('../controllers/articles-controller')
const { getComments, postComment } = require('../controllers/comments-controller')

const articleRouter = require('express').Router()



articleRouter.get('/:article_id', getArticle)

articleRouter.route('/').get(getAllArticles).post(postArticle)





articleRouter.route('/:article_id').get(getArticle).patch(patchArticle).delete(deleteArticle)

articleRouter.route('/:article_id/comments').get(getComments).post(postComment)

// articleRouter.post('/:article_id/comments', postComment)

// articleRouter.patch('/:article_id', patchArticle)

module.exports = articleRouter