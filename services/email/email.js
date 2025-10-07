import { transport, urls } from './config.js';
import { verifyUser, resetPassword } from './templates.js'
import config from '../../config.js';
const {
  SMTP_FROM_NAME,
  SMTP_FROM_EMAIL,
} = config

export const sendVerifyUserMsg = async (user, token) => {
  const verifyUrl = urls.verifyUser(token);

  const msg = {
    from: `${SMTP_FROM_NAME} <${SMTP_FROM_EMAIL}>`,
    to: user.email,
    subject: verifyUser.subject(user.name),
    html: verifyUser.html(user.name, verifyUrl),
    text: verifyUser.text(user.name, verifyUrl)
  };

  const info = await transport.sendMail(msg);
  return info;
}

export const sendResetPasswordMsg = async (user, token) => {
  const resetPasswordUrl = urls.resetPass(token);

  const msg = {
    from: `${SMTP_FROM_NAME} <${SMTP_FROM_EMAIL}>`,
    to: user.email,
    subject: resetPassword.subject,
    html: resetPassword.html(user.name, resetPasswordUrl),
    text: resetPassword.text(user.name, resetPasswordUrl)
  };

  const info = await transport.sendMail(msg);
  return info;
}