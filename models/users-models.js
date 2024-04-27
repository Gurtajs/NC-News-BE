const db = require("../db/connection");

function getUsersData() {
    return db.query('SELECT * FROM users').then((users) => {
        return users.rows
    })
}

function getUserData(username) {
    if (/\d/.test(username)) {
        return Promise.reject({status: 400, message: 'Bad request'})
    }
    return db.query(`SELECT * FROM users WHERE username = $1`, [username]).then((username) => {
        if (username.rows.length === 0) {
            return Promise.reject({status:404, message: 'Not found'})
        }
        return username.rows[0]
    })
}

module.exports = {getUsersData, getUserData}