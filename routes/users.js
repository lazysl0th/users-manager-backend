import express from 'express';
const router = express.Router();

import {
  getUsers,
  getUser,
  deleteUserByCredentials,
  deleteUnverifiedUser,
  updateBlockStatus,
  updateActiveStatus,
} from '../controllers/users.js';

router.get('/', getUsers);

router.get('/me', getUser);

router.delete('/', deleteUserByCredentials);

router.delete('/status/unverified', deleteUnverifiedUser);

router.patch('/status/blocked', updateBlockStatus);

router.patch('/status/unblocked', updateActiveStatus);

export default router;
