import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import rootRouter from './src/routes/index.js';

const { NODE_ENV, DB_ADDRESS } = process.env;
const app = express();

mongoose.connect(
  NODE_ENV === 'production'
    ? DB_ADDRESS
    : 'mongodb://127.0.0.1:27017/motyadb',
);

app.use(rootRouter);

const { PORT = 3000 } = process.env;

app.listen(PORT);

export default app;
