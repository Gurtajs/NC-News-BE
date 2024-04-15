const express = require('express')
const app = express()
const {getTopics} = require('./controllers/topics-controller')
const description = require('./endpoints.json')


app.use(express.json());

app.get('/api/topics', getTopics)

app.get('/api', (req, res, next) => {
    res.status(200).send({description})
})


module.exports = app