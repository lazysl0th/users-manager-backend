import express from 'express';
import cookieParser from 'cookie-parser';
import { Pool } from 'pg';
import helmet from 'helmet';
import { celebrate, Joi, errors } from 'celebrate';
import cors from './middlewares/cors.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';
import limiter from './middlewares/limiter.js';
import router from './routes/index.js';
import constants from './constatns.js';
import config from './config.js';

const { INTERNAL_SERVER_ERROR } = constants;

const { 
  PORT,
  DBHOST,
  DBPORT,
  DBNAME,
  DBUSER,
  DBPASS
} = config

const app = express();

app.use(helmet());

app.use(cors);

app.use(limiter);

app.use(cookieParser());

export const pool = new Pool({
  host: DBHOST,
  port: DBPORT,
  database: DBNAME,
  user: DBUSER,
  password: DBPASS,
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use((e, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR.statusCode, message } = e;
  
  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR.statusCode
      ? INTERNAL_SERVER_ERROR.text
      : message,
  });
  next();
});

app.listen(PORT);
