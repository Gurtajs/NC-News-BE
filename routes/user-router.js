const { getUsers } = require('../controllers/users-controller')
const {getUser} = require('../controllers/users-controller')

const userRouter = require('express').Router()

userRouter.get('/', getUsers)

userRouter.get('/:username', getUser)
module.exports = userRouter