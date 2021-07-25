import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId;

let posts;

export default class PostsDAO {
    static async injectDB(conn) {
        if (posts) return;

        try {
            posts = await conn.db(process.env.DREAMWORLD_NS).collection("posts");
        } catch (e) {
            console.error(`Could not establish a connection handle to the database: ${e}`);
        }
    }

    static async createPost(newPost) {
        try {
            const post = {
                ...newPost,
                user_id: ObjectId(newPost.user_id)
            }
            const result = await posts.insertOne(post);

            return result;
        } catch (e) {
            console.error(`Unable to insert post into database: ${e}`);
            return { error: e };
        }
    }

    static async updatePost(post) {
        try {
            const updateResult = await posts.updateOne(
                {
                    _id: { $eq: ObjectId(post.post_id) },
                    user_id: { $eq: ObjectId(post.user_id) }
                },
                {
                    $set: {
                        content: post.content,
                        edited: true
                    }
                }
            );

            return updateResult;
        } catch (e) {
            console.error(`Unable to update post in database: ${e}`);
            return { error: e };
        }
    }

    static async deletePost(post_id, user_id) {
        try {
            const deleteResult = await posts.deleteOne(
                {
                    _id: { $eq: ObjectId(post_id) },
                    user_id: { $eq: ObjectId(user_id) }
                }
            );

            return deleteResult;
        } catch (e) {
            console.error(`Unable to delete psot in database: ${e}`);
            return { error: e };
        }
    }
}
