import { transport, oAuth2Client } from './config.js';
import config from '../../config.js';
const {
  EMAIL_NAME,
  EMAIL_USER,
} = config

export const sendMessage = async (user, token, url, template) => {
  try {
    const verifyUrl = url(token);
    const { token: accessToken } = await oAuth2Client.getAccessToken();
    transport.options.auth.accessToken = accessToken;

    const msg = {
      from: `${EMAIL_NAME} <${EMAIL_USER}>`,
      to: user.email,
      subject: template.subject(user.name),
      html: template.html(user.name, verifyUrl),
      text: template.text(user.name, verifyUrl)
    };

    const info = await transport.sendMail(msg);
    console.log("Письмо отправлено:", info.messageId);
    return info;
  } catch (err) {
    console.error("Ошибка при отправке письма:", err);
    throw err;
  }
}