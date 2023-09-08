require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { rootRouter } = require('./routes');

const { NODE_ENV, DB_ADDRESS } = process.env;
const app = express();

mongoose.connect(
  NODE_ENV === 'production'
    ? DB_ADDRESS
    : 'mongodb://127.0.0.1:27017/bitfilmsdb',
);

app.use(rootRouter);

const { PORT = 3000 } = process.env;

app.listen(PORT);

module.exports = app;
