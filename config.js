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
  SMTP_FROM_EMAIL,
  BACKEND,
  FRONTEND
} = process.env;

const config = {
  PORT: NODE_ENV === 'production' && PORT ? PORT : 3001,
  FPORT: NODE_ENV === 'production' && FPORT ? FPORT : 5173,
  HOST: NODE_ENV === 'production' && HOST ? HOST : 'localhost',
  JWT_SECRET: NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'JWT_SECRET_DEV',
  DBHOST: NODE_ENV === 'production' && DBHOST ? DBHOST : 'localhost',
  DBPORT: NODE_ENV === 'production' && DBPORT ? DBPORT : 5432,
  DBNAME: NODE_ENV === 'production' && DBNAME ? DBNAME : 'adminpaneldb',
  DBUSER: NODE_ENV === 'production' && DBUSER ? DBUSER : 'adminpaneluser',
  DBPASS: NODE_ENV === 'production' && DBPASS ? DBPASS : 'secret',
  SMTP_HOST: NODE_ENV === 'production' && SMTP_HOST ? SMTP_HOST : 'smtp.gmail.com',
  SMTP_PORT: NODE_ENV === 'production' && SMTP_PORT ? SMTP_PORT : 587,
  SMTP_USER: NODE_ENV === 'production' && SMTP_USER ? SMTP_USER : 'u69740384@gmail.com',
  SMTP_PASS: NODE_ENV === 'production' && SMTP_PASS ? SMTP_PASS : 'tjsm yogr dxly qmui',
  SMTP_FROM_NAME: NODE_ENV === 'production' && SMTP_FROM_NAME ? SMTP_FROM_NAME : 'User manager',
  SMTP_FROM_EMAIL: NODE_ENV === 'production' && SMTP_FROM_EMAIL ? SMTP_FROM_EMAIL : 'u69740384@gmail.com',
  BACKEND: NODE_ENV === 'production' && BACKEND ? BACKEND : 'https://user-management-backend-gorj.onrender.com',
  FRONTEND: NODE_ENV === 'production' && FRONTEND ? FRONTEND : 'https://user-management-frontend-mu.vercel.app',
};

export default config