const apiRouter = require('express').Router()
const description = require("../endpoints.json");
const articleRouter = require('./articles-router')
const commentRouter = require('./comments-router');
const topicRouter = require('./topic-router');
const userRouter = require('./user-router');
apiRouter.get("/", (req, res, next) => {
    res.status(200).send({ description });
  });

apiRouter.use('/articles', articleRouter)

apiRouter.use('/comments', commentRouter)

apiRouter.use('/topics', topicRouter)

apiRouter.use('/users', userRouter)



module.exports = apiRouter;
