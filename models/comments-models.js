const db = require("../db/connection")

function getCommentsData(article_id, sort_by = "created_at", order = "desc") {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY ${sort_by} ${order};`, [article_id]).then((comments) => {
        if (comments.rows.length === 0) {
            return Promise.reject({status: 404, message: "Article not found"})
        }
        return comments.rows
    })
}

module.exports = {getCommentsData}

