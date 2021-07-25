import PostsDAO from '../dao/PostsDAO.js';

export default class PostsController {
    static async apiCreatePost(req, res, next) {
        try {
            const user_id = req.body.user_id;
            const content = req.body.content;
            
            const dateCreated = new Date();
            
            const newPost = {
                user_id,
                content,
                votes: 0,
                stars: 0,
                edited: false,
                dateCreated,
                commentIds: []
            };

            const result = await PostsDAO.createPost(newPost);

            res.json({ status: "success" });
        } catch (e) {
            console.error(`Unable to create post: ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiUpdatePost(req, res, next) {
        try {
            const user_id = req.body.user_id;
            const content = req.body.content;
            const post_id = req.params.post_id;

            const newPost = {
                post_id,
                user_id,
                content
            };

            const result = await PostsDAO.updatePost(newPost);

            res.json({ status: "success" });

        } catch (e) {
            console.error(`Unable to update post: ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiDeletePost(req, res, next) {
        try {
            const post_id = req.params.post_id;
            const user_id = req.body.user_id;

            const result = await PostsDAO.deletePost(post_id, user_id);

            res.status(204).json({ status: "success" });

        } catch (e) {
            console.error(`Unable to delete post: ${e}`);
            res.status(500).json({ error: e });
        }
    }

}