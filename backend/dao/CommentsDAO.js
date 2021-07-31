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
                user_id: ObjectId(newComment.user_id),
                parent_id: ObjectId(newComment.parent_id)
            }
            const result = await comments.insertOne(comment);
            if (comment.isTopLevel) {
                const insertCommentResult = await PostsDAO.insertTopLevelChildComment(comment.post_id, result.insertedId);
            } else {
                console.log('here');
                const insertCommentResult = await CommentsDAO.insertChildComment(comment.parent_id, result.insertedId);
            }
            

            return result;
        } catch (e) {
            console.error(`Unable to insert comment in database: ${e}`);
            return { error: e };
        }
    }

    static async updateComment(comment) {
        try {
            const edited_at = new Date();
            const updateResult = await comments.updateOne(
                {
                    _id: { $eq: ObjectId(comment.comment_id) },
                    user_id: { $eq: ObjectId(comment.user_id) }
                },
                {
                    $set: {
                        content: comment.content,
                        edited: true,
                        edited_at: edited_at
                    }
                }
            );

            return updateResult;
        } catch (e) {
            console.error(`Unable to update comment in database: ${e}`);
            return { error: e };
        }
    }

    // If comment is deleted, just mark it as deleted, don't remove it from database
    static async deleteComment(comment_id, user_id) {
        try {
            const deleted_at = new Date();
            const deleteResult = await comments.updateOne(
                {
                    _id: { $eq: ObjectId(comment_id) },
                    // user_id: { $eq: ObjectId(user_id) }
                },
                {
                    $set: {
                        deleted: true,
                        deleted_at: deleted_at
                    }
                }
            );

            return deleteResult;
        } catch (e) {
            console.error(`Unable to mark comment as deleted in database: ${e}`);
            return { error: e };
        }
    }

    static async insertChildComment(parent_comment_id, child_comment_id) {
        try {
            const result = comments.updateOne(
                {
                    _id: { $eq: ObjectId(parent_comment_id) }
                },
                {
                    $push: { childrenIds: ObjectId(child_comment_id) }
                }
            );
        } catch (e) {
            console.error(`Unable to insert child comment id in parent's children array in database: ${e}`);
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

            let threads = [];
            for (const commentId of post.commentIds) {
                const thread = await CommentsDAO.getCommentThread(commentId);
                threads.push(thread);
            }

            // const threads = post.commentIds.map(async commentId => {
            //     return await CommentsDAO.getCommentThread(commentId);
            // });

            return threads;
        } catch (e) {
            console.error(`Unable to get all comment threads: ${e}`);
            return { error: e };
        }
        
    }
}