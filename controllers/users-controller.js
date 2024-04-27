const {getUsersData, getUserData} = require("../models/users-models")

function getUsers(req, res, next) {
    getUsersData().then((users) => {
        res.status(200).send({users})
    }).catch(next)
}

function getUser(req, res, next) {
    const {username} = req.params
    getUserData(username).then((username) => {
        res.status(200).send({username})
    }).catch(next)
}


module.exports = {getUsers, getUser}