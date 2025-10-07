
import jwt from 'jsonwebtoken';
import config from '../config.js';
import { sendVerifyUserMsg, sendResetPasswordMsg } from '../services/email/email.js';
const { BAD_REQUEST, UNAUTHORIZED, BLOCKED, RESET_PASSWORD, NO_CONTENT} = constatns;

const { JWT_SECRET } = config;

import {
  insertUserQuery,
  selectUserByCredentialsQuery,
  updateLastLoginQuery,
  selectUserByIdQuery,
  deleteUserByCredentialsQuery,
  deleteUnverifiedUserQuery,
  selectAllUsersQuery,
  updateBlockStatusQuery,
  updateActiveStatusQuery,
  selectUserByVerifyTokenQuery,
  insertVerifyTokenQuery,
  selectUserByEmail,
  insertNewPasswordQuery,
  insertResetTokenQuery,
  updateUnverifyStatusQuery
} from '../models/user.js';

import BadRequestErr from '../errors/bad-request-err.js';
import Unauthorized from '../errors/unauthorized.js';
import Forbidden from '../errors/forbidden-err.js';
import constatns from '../constatns.js';
const {
  CREATED,
  OK,
} = constatns;

export const getUsers = async (req, res, next) => {
  try {
    const users = await selectAllUsersQuery()
    return res.status(OK.statusCode).send(users)
  } catch (e) {
    console.log(e)
    return next(e);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await insertUserQuery(
      req.body.name,
      req.body.email,
      req.body.password
    );
    const token = jwt.sign({ id: user.id, type: 'verify' }, JWT_SECRET, { expiresIn: '1h' });
    await insertVerifyTokenQuery(token, user.id);
    await sendVerifyUserMsg(user, token);
    res.status(CREATED.statusCode).send(user);
  } catch (e) {
    console.log(e)
    if (e.code == '23514' || e.name == '23502' || e.name == '22001') return next(new BadRequestErr(BAD_REQUEST.text))
    return next(e)
  }
};

export const verifyUser = async (req, res, next)=> {
  try {
    const tokenInfo = jwt.verify(req.query.token, JWT_SECRET);
    if (tokenInfo.type != 'verify') throw new BadRequestErr(BAD_REQUEST.text)
    const user = await selectUserByVerifyTokenQuery(req.query.token);
    await updateActiveStatusQuery(user.id);
    await insertVerifyTokenQuery('', user.id);
    return res.redirect('http://localhost:5173/').send({});
  } catch (e) {
    if (e.code == '23514' || e.name == '23502' || e.name == '22001') return next(new BadRequestErr(BAD_REQUEST.text))
  }
}

export const deleteUserByCredentials = async (req, res, next) => {
  try {
    return res.status(OK.statusCode).send(await deleteUserByCredentialsQuery(req.body.usersId));
  } catch(e) {
    console.log(e)
    if (e.code == '23514' || e.name == '23502' || e.name == '22001') return next(new BadRequestErr(BAD_REQUEST.text));
    return next(e);
  }
};

export const deleteUnverifiedUser = async (req, res, next) => {
  try {
    return res.status(OK.statusCode).send(await deleteUnverifiedUserQuery());
  } catch (e) {
    if (e.code == '23514' || e.name == '23502' || e.name == '22001') throw BadRequestErr(BAD_REQUEST.text);
    return next(e)
  }
};

export const updateBlockStatus = async (req, res, next) => {
  try {
    return res.status(OK.statusCode).send(await updateBlockStatusQuery(req.body.usersId));
  } catch (e) {
    console.log(e)
    if (e.code == '23514' || e.name == '23502' || e.name == '22001') throw BadRequestErr(BAD_REQUEST.text);
    return next(e)
  }
}

export const updateActiveStatus = async (req, res, next) => {
  try {
    const users = await selectUserByIdQuery(req.body.usersId);
    const unverifiedUsersId = users.map(user => {if (user.verify_token) return user.id})
    const activeUsersId = users.map(user => {if (!user.verify_token) return user.id})
    const unverifiedStatusIds = await updateUnverifyStatusQuery(unverifiedUsersId);
    const activeStatusIds = await updateActiveStatusQuery(activeUsersId);
    return res.status(OK.statusCode).send([ ...unverifiedStatusIds, ...activeStatusIds]);
  } catch (e) {
    console.log(e)
    if (e.code == '23514' || e.name == '23502' || e.name == '22001') throw BadRequestErr(BAD_REQUEST.text);
    return next(e)
  }
}

export const login = async (req, res, next) => {
  try {
    const user = await selectUserByCredentialsQuery(req.body.email, req.body.password);
    if (!user) throw new Unauthorized(UNAUTHORIZED.text);
    if (user.status == 'Blocked') throw new Forbidden(BLOCKED.text);
    const lastLogin = await updateLastLoginQuery(user.id);
    if (req.body.remember) {
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(OK.statusCode).cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      }).send({
        id: user.id, email: user.email, name: user.name, lastLogin: lastLogin.last_login, status: user.status
      });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '2h' });
    return res.status(OK.statusCode).cookie('token', token, {
        maxAge: 3600000 * 2,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: 'users-manager-frontend-i0c9.onrender.com'
      }).send({
        id: user.id, email: user.email, name: user.name, lastLogin: lastLogin.last_login, status: user.status
      });
  } catch (e) {
    console.log(e)
    if (e.code == '23514' || e.name == '23502' || e.name == '22001') throw new BadRequestErr(BAD_REQUEST.text);
    return next(e);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const [ user ] = await selectUserByIdQuery(req.user.id);
    if (user.status == 'Blocked') throw new Forbidden(BLOCKED.text)
    return res.status(OK.statusCode).send(user);
  } catch (e) {
    console.log(e)
    if (e.code == '23514' || e.name == '23502' || e.name == '22001') throw new BadRequestErr(BAD_REQUEST.text);
    return next(e);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const user = await selectUserByEmail(req.body.email);
    const token = jwt.sign({ id: user.id, type: "reset" }, JWT_SECRET, { expiresIn: '15m' });
    await insertResetTokenQuery(token, user.id);
    await sendResetPasswordMsg(user, token)
    return res.status(OK.statusCode).send({text: RESET_PASSWORD.text});
  } catch (e) {
    console.log(e);
    return next(e);
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const tokenInfo = jwt.verify(req.body.token, JWT_SECRET);
    if (tokenInfo.type != 'reset') throw new BadRequestErr(BAD_REQUEST.text)
    const user = await insertNewPasswordQuery(req.body.password, req.body.token);
    await insertResetTokenQuery('', user.id);
    return res.status(NO_CONTENT.statusCode).send(NO_CONTENT.text);
  } catch(e) {
    console.log(e);
    return next(e);
  }
}

export const logout = (req, res) => res.status(OK.statusCode).cookie('token', {
  expires: Date.now(),
  httpOnly: true, 
  secure: true, 
  sameSite: 'none', 
  path: '/',
}).send({});