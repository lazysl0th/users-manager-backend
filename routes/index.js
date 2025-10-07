import express from 'express';
import usersRoutes from './users.js';
import { login, createUser, verifyUser, resetPassword, changePassword } from '../controllers/users.js';
import auth from '../middlewares/auth.js'
import NotFoundError from '../errors/not-found-err.js';
import constatns from '../constatns.js';
import { signinValidation, signupValidation } from '../middlewares/validation.js';

const { NOT_FOUND } = constatns;

const router = express.Router();

router.post('/signin', login);

router.post('/signup', createUser);

router.get('/verifyuser', verifyUser);

router.post('/resetpassword', resetPassword),

router.post('/changepassword', changePassword),

router.use(auth);

router.use('/users', usersRoutes);

router.use((req, res, next) => next(new NotFoundError(NOT_FOUND.text)));

export default router;



