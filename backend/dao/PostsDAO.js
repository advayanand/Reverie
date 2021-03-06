import mongodb from 'mongodb'
import VotesDAO from './VotesDAO.js';
const ObjectId = mongodb.ObjectId;

let posts;

export default class PostsDAO {
    static async injectDB(conn) {
        if (posts) return;

        try {
            posts = await conn.db(process.env.REVERIE_NS).collection("posts");
        } catch (e) {
            console.error(`Could not establish a connection handle to the database: ${e}`);
        }
    }

    static async getPost(user_id, post_id) {
        try {
            const post = await posts.findOne(
                {
                    _id: { $eq: ObjectId(post_id) }
                }
            );

            // console.log(post);

            const vote = await VotesDAO.getPostVote(user_id, post_id);

            post.user_vote = vote ? vote.vote : 0;

            console.log(post);

            return post;
        } catch (e) {
            console.error(`Unable to find post in database: ${e}`);
            return { error: e };
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
            const edited_at = new Date();
            const updateResult = await posts.updateOne(
                {
                    _id: { $eq: ObjectId(post.post_id) },
                    user_id: { $eq: ObjectId(post.user_id) }
                },
                {
                    $set: {
                        content: post.content,
                        edited: true,
                        edited_at
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
            // const deleted_at = new Date();
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

    static async insertTopLevelChildComment(post_id, comment_id) {
        try {
            const result = await posts.updateOne(
                {
                    _id: { $eq: ObjectId(post_id) }
                },
                {
                    $push: { commentIds: ObjectId(comment_id) }
                }
            );
        } catch (e) {
            console.error(`Unable to insert top level child comment in database: ${e}`);
            return { error: e };
        }
    }

    static async getPostsForUser(user_id) {
        try {
            const cursor = posts.find();
            const displayCursor = await cursor.limit(20);
            const postsForUser = await displayCursor.toArray();

            return {
                postCount: postsForUser.length,
                posts: postsForUser
            };
        } catch (e) {
            console.error(`Unable to get posts for user in database: ${e}`);
            return { error: e };
        }
    }

    static async changeScore(post_id, amount) {
        console.log('changing score of post id ', post_id, 'amount = ', amount);
        try {
            const result = await posts.updateOne(
                {
                    _id: { $eq: ObjectId(post_id) },
                    // user_id: { $eq: ObjectId(user_id) }
                },
                {
                    $inc: { score: amount }
                }
            );

            console.log(result.matchedCount, result.modifiedCount);
        } catch (e) {
            console.error(`somrthing went wrong: ${e}`);
        }
    }
}
