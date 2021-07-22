import express from 'express';
import UsersDAO from '../dao/UsersDAO';

const router = express.Router();

router.route('/users').get(UsersDAO.apiGetUsers);

export default router;
