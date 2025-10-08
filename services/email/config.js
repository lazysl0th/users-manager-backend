import { google } from "googleapis";
import config from '../../config.js';

const {
  NODE_ENV,
  HOST,
  FPORT,
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN,
  BACKEND,
  FRONTEND
} = config

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

export const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

export const urls = {
  verifyUser: (token) => (`${BACKEND}/verifyuser?token=${token}`),

  resetPass: (token) => (`${FRONTEND}/change-password?token=${token}`),
}