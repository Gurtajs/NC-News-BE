const express = require("express");
const app = express();
const cors = require('cors')

app.use(cors())
app.use(express.json());

const apiRouter = require('./routes/api-router')
app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ message: "Not found" });
  }
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } 
  if (err.code === '22P02') {
    res.status(400).send({ message: "Bad request"})
  }
});

module.exports = app;
