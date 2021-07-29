import PostsDAO from './PostsDAO.js';
import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

let comments;

export default class CommentsDAO {
    static async injectDB(conn) {
        if (comments) return;

        try {
            comments = await conn.db(process.env.DREAMWORLD_NS).collection("comments");
        } catch (e) {
            console.error(`Could not establish a connection handle to the database: ${e}`);
        }
    }

    static async getComment(comment_id) {
        try {
            const result = await comments.findOne(
                {
                    _id: { $eq: ObjectId(comment_id) }
                }
            );

            return result;
        } catch (e) {
            console.error(`Unable to get comment from database: ${e}`);
            return { error: e };
        }
    }

    static async createComment(newComment) {
        try {
            const comment = {
                ...newComment,
                user_id: ObjectId(newComment.user_id)
            }
            const result = await comments.insertOne(comment);
            const insertCommentResult = await PostsDAO.insertTopLevelChildComment(comment.post_id, result.insertedId);

            return result;
        } catch (e) {
            console.error(`Unable to insert post into database: ${e}`);
            return { error: e };
        }
    }

    static async updateComment(comment) {
        try {
            const updateResult = await comments.updateOne(
                {
                    _id: { $eq: ObjectId(comment.comment_id) },
                    user_id: { $eq: ObjectId(comment.user_id) }
                },
                {
                    $set: {
                        content: comment.content
                    }
                }
            );

            return updateResult;
        } catch (e) {
            console.error(`Unable to update post in database: ${e}`);
            return { error: e };
        }
    }

    // If comment is deleted, just mark it as
    static async deleteComment(comment_id, user_id) {
        try {
            const deleteResult = await comments.updateOne(
                {
                    _id: { $eq: ObjectId(comment_id) },
                    user_id: { $eq: ObjectId(user_id) }
                },
                {
                    $set: {
                        deleted: true
                    }
                }
            );

            return deleteResult;
        } catch (e) {
            console.error(`Unable to mark comment as deleted in database: ${e}`);
            return { error: e };
        }
    }

    static async getCommentThread(comment_id) {
        try {
            const cursor = await comments.find(
                {
                    _id: { $eq: ObjectId(comment_id) }
                }
            );

            const parentComment = await cursor.next();

            console.log(parentComment);
            
            if (parentComment.childrenIds.length === 0) {
                parentComment.childrenComments = [];
                return parentComment;
            }
            let childrenComments = [];

            for (const commentId of parentComment.childrenIds) {
                const thread = await CommentsDAO.getCommentThread(commentId);
                childrenComments.push(thread);
            }

            parentComment.childrenComments = childrenComments;
            return parentComment;

        } catch (e) {
            console.error(`Unable to get comment thread from database: ${e}`);
            return { error: e };
        }
    }

    static async getAllCommentThreadsOnPost(post_id) {
        try {
            const post = await PostsDAO.getPost(post_id);

            console.log('getallcommentthreads post: ', post);

            let threads = [];
            for (const commentId of post.commentIds) {
                const thread = await CommentsDAO.getCommentThread(commentId);
                threads.push(thread);
            }

            return threads;
        } catch (e) {
            console.error(`Unable to get all comment threads: ${e}`);
            return { error: e };
        }
        
    }
}