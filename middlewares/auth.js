import jwt from 'jsonwebtoken';
import Forbidden from '../errors/forbidden-err.js'
import config from '../config.js';
import constatns from '../constatns.js';

const { JWT_SECRET } = config
const { FORBIDDEN } = constatns;

export default (req, res, next) => {
  console.log(req.cookies);
  const { token } = req.cookies;
  console.log(JWT_SECRET);

  if (!token) {
    throw new Forbidden(FORBIDDEN.text);
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Forbidden(FORBIDDEN.text);
  }
  console.log(payload);
  req.user = payload;
  console.log(req.user);
  return next();
};