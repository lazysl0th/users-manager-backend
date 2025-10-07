import jwt from 'jsonwebtoken';
import Forbidden from '../errors/forbidden-err.js'
import config from '../config.js';
import constatns from '../constatns.js';

const { JWT_SECRET } = config
const { FORBIDDEN } = constatns;

export default (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new Forbidden(FORBIDDEN.text);
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Forbidden(FORBIDDEN.text);
  }

  req.user = payload;
  return next();
};