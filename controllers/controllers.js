const {getTopicsData} = require('../models/models')

function getTopics(req, res, next) {
    getTopicsData().then((topics) => {
        res.status(200).send({topics})
    }).catch(next)
}

module.exports = {getTopics}