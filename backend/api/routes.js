import express from 'express';
import CommentsController from './CommentsController.js';
import PostsController from './PostsController.js';
import UsersController from './UsersController.js';
import VotesController from './VotesController.js';

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

router.route('/login').post(UsersController.apiAuthenticateUser);

router.route('/thread').get(CommentsController.apiGetCommentThread);

router.route('/posts/:post_id/threads').get(CommentsController.apiGetAllCommentThreadsOnPost);

router.route('/posts').get(PostsController.apiGetPostsForUser);

router.route('/comments/:comment_id/vote')
    .post(VotesController.apiCreateCommentVote)
    .put(VotesController.apiUpdateCommentVote)
    .delete(VotesController.apiDeleteCommentVote);

router.route('/posts/:post_id/vote')
    .post(VotesController.apiCreatePostVote)
    .put(VotesController.apiUpdatePostVote)
    .delete(VotesController.apiDeletePostVote);

// router.route('')

// router.route('/maintenance')
//     .post(CommentsController.maintenance)

router.route('/').get((req, res, next) => {
    res.json({ text: "Hello World!" });
});

export default router;
