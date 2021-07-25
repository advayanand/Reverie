import CommentsDAO from '../dao/CommentsDAO.js'

export default class CommentsController {
    static async apiCreateComment(req, res, next) {
        try {
            const user_id = req.body.user_id;
            const content = req.body.content;
            const isTopLevel = req.body.isTopLevel;
            const parentId = req.body.parentId;
            
            const newComment = {
                user_id,
                content,
                isTopLevel,
                parent,
                deleted: true,
                childrenIds: []
            }

            const result = await CommentsDAO.createComment(newComment);

            res.json({ status: "success" });
        } catch (e) {
            console.error(`Unable to create comment: ${e}`);
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
}