import express from 'express';
import CommentsController from './CommentsController.js';
import PostsController from './PostsController.js';
import UsersController from './UsersController.js';

const router = express.Router();

router.route('/users')
    .post(UsersController.apiCreateUser)
    
router.route('/users/:user_id')
    .get(UsersController.apiGetUser)
    .put(UsersController.apiUpdateUser)
    .delete(UsersController.apiDeleteUser);

router.route('/posts')
    .post(PostsController.apiCreatePost);

router.route('/posts/:post_id')
    .get(PostsController.apiGetPost)
    .put(PostsController.apiUpdatePost)
    .delete(PostsController.apiDeletePost);

router.route('/comments')
    .post(CommentsController.apiCreateComment);

router.route('/comments/:comment_id')
    .get(CommentsController.apiGetComment)
    .put(CommentsController.apiUpdateComment)
    .delete(CommentsController.apiDeleteComment);

router.route('/hello').get((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ text: "Hello World!" });
});

router.route('/getThread').get(CommentsController.apiGetCommentThread);

router.route('/getAllThreads').get(CommentsController.apiGetAllCommentThreadsOnPost);

router.route('/').get((req, res, next) => {
    res.json({ text: "Hello World!" });
});

export default router;
