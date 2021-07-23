import express from 'express';
import UsersController from './UsersController.js';

const router = express.Router();

router.route('/users')
    // .get(UsersController.apiGetUser)
    .post(UsersController.apiCreateUser)
    .put(UsersController.apiUpdateUser);

router.route('/hello').get((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ text: "Hello World!" });
});

router.route('/').get((req, res, next) => {
    res.json({ text: "Hello World!" });
});

export default router;
