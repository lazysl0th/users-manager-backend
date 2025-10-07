import 'dotenv/config';

const {
  NODE_ENV,
  HOST,
  PORT,
  FPORT,
  JWT_SECRET,
  DBHOST,
  DBPORT,
  DBNAME,
  DBUSER,
  DBPASS,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM_NAME,
  BACKEND,
  FRONTEND
} = process.env;

const config = {
  PORT: NODE_ENV === 'production' && PORT ? PORT : 3001,
  FPORT: NODE_ENV === 'production' && FPORT ? FPORT : 5174,
  HOST: NODE_ENV === 'production' && HOST ? HOST : 'localhost',
  JWT_SECRET: NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'JWT_SECRET_DEV',
  DBHOST: NODE_ENV === 'production' && DBHOST ? DBHOST : 'localhost',
  DBPORT: NODE_ENV === 'production' && DBPORT ? DBPORT : 5432,
  DBNAME: NODE_ENV === 'production' && DBNAME ? DBNAME : 'adminpaneldb',
  DBUSER: NODE_ENV === 'production' && DBUSER ? DBUSER : 'adminpaneluser',
  DBPASS: NODE_ENV === 'production' && DBPASS ? DBPASS : 'secret',
  EMAIL_USER: NODE_ENV === 'production' && EMAIL_USER ? EMAIL_USER : '',
  EMAIL_NAME: NODE_ENV === 'production' && EMAIL_NAME ? EMAIL_NAME : 'User manager',
  BACKEND: NODE_ENV === 'production' && BACKEND ? BACKEND : '',
  FRONTEND: NODE_ENV === 'production' && FRONTEND ? FRONTEND : '',
  CLIENT_ID: NODE_ENV === 'production' && CLIENT_ID ? CLIENT_ID : '',
  CLIENT_SECRET: NODE_ENV === 'production' && CLIENT_SECRET ? CLIENT_SECRET : '',
  REFRESH_TOKEN: NODE_ENV === 'production' && REFRESH_TOKEN ? REFRESH_TOKEN : '',
};

export default config