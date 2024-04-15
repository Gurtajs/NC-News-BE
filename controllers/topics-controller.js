const {getTopicsData} = require('../models/topics-models')
const description = require('../endpoints.json')
function getTopics(req, res, next) {
    getTopicsData().then((topics) => {
        res.status(200).send({topics})
    }).catch(next)
}



module.exports = {getTopics}