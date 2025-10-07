import nodemailer from 'nodemailer';
import config from '../../config.js';

const {
  NODE_ENV,
  HOST,
  PORT,
  FPORT,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
} = config

export const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const urls = {
  verifyUser: (token) => (NODE_ENV === 'production' 
                            ? `${BACKEND}/verifyuser?token=${token}`
                            : `http://${HOST}:${PORT}/verifyuser?token=${token}`),

  resetPass: (token) => (NODE_ENV === 'production'
                          ? `http://${FRONTEND}/change-password?token=${token}`
                          : `http://${HOST}:${FPORT}/change-password?token=${token}`),
}