import VotesDAO from '../dao/VotesDAO.js';


export default class VotesController {
    static async apiCreateCommentVote(req, res, next) {
        try {
            const user_id = req.body.user_id;
            const comment_id = req.body.comment_id;
            const vote = req.body.vote;

            console.log(comment_id);

            const posted_at = new Date();

            const newVote = {
                user_id,
                comment_id,
                vote,
                posted_at
            };

            console.log(newVote);
            const result = VotesDAO.createCommentVote(newVote);

            res.json(newVote);
        } catch (e) {
            console.error(`Unable to create comment vote: ${e}`);
            res.json({ error: e });
        }
    }

    static async apiUpdateCommentVote(req, res, next) {
        try {
            const comment_id = req.params.comment_id;
            const user_id = req.body.user_id;
            const vote = req.body.vote;

            const newVoteInfo = {
                comment_id,
                user_id,
                vote
            };

            const updatedVote = await VotesDAO.updateCommentVote(newVoteInfo);

            res.json(updatedVote);

        } catch (e) {
            console.error(`Unable to update comment vote: ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiDeleteCommentVote(req, res, next) {
        try {
            const user_id = req.query.u;
            const comment_id = req.params.comment_id;
            // const vote = req.body.vote;

            // const deletedVoteInfo = {
            //     comment_id,
            //     user_id,
            //     vote
            // };

            const deletedVote = await VotesDAO.deleteCommentVote(user_id, comment_id);

            res.json(deletedVote);
        } catch (e) {
            console.error(`Unable to delete comment vote: ${e}`);
            res.status(500).json({ error: e });
        }
    }









    static async apiCreatePostVote(req, res, next) {
        try {
            const user_id = req.body.user_id;
            const post_id = req.body.post_id;
            const vote = req.body.vote;

            const posted_at = new Date();

            const newVote = {
                user_id,
                post_id,
                vote,
                posted_at
            }
            const result = VotesDAO.createPostVote(newVote);

            res.json(newVote);
        } catch (e) {
            console.error(`Unable to create post vote: ${e}`);
            res.json({ error: e });
        }
    }

    static async apiUpdatePostVote(req, res, next) {
        try {
            const post_id = req.params.post_id;
            const user_id = req.body.user_id;
            const vote = req.body.vote;

            const newVoteInfo = {
                post_id,
                user_id,
                vote
            };

            const updatedVote = await VotesDAO.updatePostVote(newVoteInfo);

            res.json(updatedVote);

        } catch (e) {
            console.error(`Unable to update post vote: ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiDeletePostVote(req, res, next) {
        try {
            const user_id = req.body.user_id;
            const post_id = req.params.post_id;
            const vote = req.body.vote;

            const deletedVoteInfo = {
                post_id,
                user_id,
                vote
            };

            const deletedVote = await VotesDAO.deletePostVote(deletedVoteInfo);

            res.json(deletedVoteInfo);
        } catch (e) {
            console.error(`Unable to delete post vote: ${e}`);
            res.status(500).json({ error: e });
        }
    }



    

}