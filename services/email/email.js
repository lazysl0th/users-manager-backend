import { gmail } from './config.js';
import { msgTemplate } from './templates.js'
import config from '../../config.js';
const {
  EMAIL_NAME,
  EMAIL_USER,
} = config

export const sendMessage = async (user, token, url, template) => {
  try {
    const verifyUrl = url(token);

    const subject = template.subject(user.name);
    const html = template.html(user.name, verifyUrl);
    const text = template.text(user.name, verifyUrl);

    const messageParts = [msgTemplate(EMAIL_NAME, EMAIL_USER, user.email, subject, text, html)];

    const encodedMessage = Buffer.from(messageParts.join("\n"))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const msg = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });
    return msg.data;
  } catch (e) {
    console.log(e);
  }
};
