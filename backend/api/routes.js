import express from 'express';
import PostsController from './PostsController.js';
import UsersController from './UsersController.js';

const router = express.Router();

router.route('/users')
    .post(UsersController.apiCreateUser)
    
router.route('/users/:user_id')
    // .get(UsersController.apiGetUser)
    .put(UsersController.apiUpdateUser)
    .delete(UsersController.apiDeleteUser);

router.route('/posts')
    .post(PostsController.apiCreatePost);

router.route('/posts/:post_id')
    // .get(PostsController.apiGetPost)
    .put(PostsController.apiUpdatePost)
    .delete(PostsController.apiDeletePost);

router.route('/hello').get((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ text: "Hello World!" });
});

router.route('/').get((req, res, next) => {
    res.json({ text: "Hello World!" });
});

export default router;
