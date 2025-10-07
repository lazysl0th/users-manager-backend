import nodemailer from 'nodemailer';
import { google } from "googleapis";
import config from '../../config.js';

const {
  NODE_ENV,
  HOST,
  PORT,
  FPORT,
  EMAIL_USER,
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN,
} = config

export const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

export const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EMAIL_USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: null,
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