import CommentsDAO from '../dao/CommentsDAO.js'

export default class CommentsController {

    static async apiGetComment(req, res, next) {
        try {
            const comment_id = req.params.user_id;
            const comment = await CommentsDAO.getComment(comment_id);

            res.json(comment);
            
        } catch (e) {
            console.error(`Unable to get comment: ${e}`);
            res.status(500).json({ error: e });
        }
    }


    static async apiCreateComment(req, res, next) {
        try {
            const user_id = req.body.user_id;
            const content = req.body.content;
            const isTopLevel = req.body.isTopLevel;
            const parent_id = req.body.parent_id;
            const post_id = req.body.post_id;

            const posted_at = new Date();
            
            const newComment = {
                user_id,
                content,
                isTopLevel,
                post_id,
                parent_id,
                votes: 0,
                stars: 0,
                deleted: false,
                deleted_at: null,
                edited: false,
                edited_at: null,
                posted_at,
                childrenIds: []
            };


            const result = await CommentsDAO.createComment(newComment);

            const returnedComment = {
                _id: result.insertedId.toString(),
                ...newComment
            };

            res.json(returnedComment);
        } catch (e) {
            console.error(`Unable to create comment: ${e}`);
            console.log('here');
            res.status(500).json({ error: e });
        }
    }

    static async apiUpdateComment(req, res, next) {
        try {
            const comment_id = req.params.comment_id;
            const user_id = req.body.user_id;
            const content = req.body.content;

            const newCommentInfo = {
                comment_id,
                user_id,
                content
            };

            const result = await CommentsDAO.updateComment(newCommentInfo);

            res.json({ status: "success" });

        } catch (e) {
            console.error(`Unable to update comment: ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiDeleteComment(req, res, next) {
        try {
            const comment_id = req.params.comment_id;
            const user_id = req.body.user_id;

            const result = await CommentsDAO.deleteComment(comment_id, user_id);

            res.status(204).json({ status: "success" });

        } catch (e) {
            console.error(`Unable to delete comment: ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiGetCommentThread(req, res, next) {
        try {
            const comment_id = req.body.comment_id;
            const result = await CommentsDAO.getCommentThread(comment_id);

            res.json(result);
        } catch (e) {
            console.error(`Unable to get comment thread: ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiGetAllCommentThreadsOnPost(req, res, next) {
        try {
            const post_id = req.query.p;
            console.log('post_id: ', post_id);
            const threads = await CommentsDAO.getAllCommentThreadsOnPost(post_id);
            res.json(threads);
        } catch (e) {
            console.error(`Unable to get all comment thread: ${e}`);
            res.status(500).json({ error: e });
        }
    }

}