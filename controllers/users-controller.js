const {getUsersData} = require("../models/users-models")

function getUsers(req, res, next) {
    getUsersData().then((users) => {
        res.status(200).send({users})
    }).catch(next)
}



module.exports = {getUsers}