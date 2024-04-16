const {getCommentsData} = require('../models/comments-models')

function getComments(req, res, next) {
    const {article_id} = req.params
    getCommentsData(article_id).then((comments) => {
        res.status(200).send({comments})
    }).catch(next)
}

module.exports = {getComments}