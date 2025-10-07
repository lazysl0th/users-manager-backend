import { transport } from './config.js';
import config from '../../config.js';
const {
  SMTP_FROM_NAME,
  SMTP_USER,
} = config

export const sendMessage = async (user, token, url, template) => {
  const verifyUrl = url(token);

  const msg = {
    from: `${SMTP_FROM_NAME} <${SMTP_USER}>`,
    to: user.email,
    subject: template.subject(user.name),
    html: template.html(user.name, verifyUrl),
    text: template.text(user.name, verifyUrl)
  };

  const info = await transport.sendMail(msg);
  return info;
}