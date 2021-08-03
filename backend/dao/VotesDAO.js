import PostsDAO from '../dao/PostsDAO.js';
import CommentsDAO from '../dao/CommentsDAO.js';

import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

let post_votes;
let comment_votes;

export default class VotesDAO {
    static async injectDB(conn) {
        if (post_votes && comment_votes) return;

        try {
            post_votes = await conn.db(process.env.DREAMWORLD_NS).collection("post_votes");
            comment_votes = await conn.db(process.env.DREAMWORLD_NS).collection("comment_votes");
        } catch (e) {
            console.error(`Could not establish a connection handle to the database: ${e}`);
        }
    }

    static async getCommentVote(user_id, comment_id) {
        try {
            // console.log('user id', user_id, 'comment id', comment_id);
            const vote = await comment_votes.findOne(
                {
                    user_id: { $eq: ObjectId(user_id) },
                    comment_id: { $eq: ObjectId(comment_id) }
                }
            );

            return vote;
        } catch (e) {
            console.error(`Unable to get comment vote from database: ${e}`);
            return { error: e };
        }
    }

    static async createCommentVote(vote) {
        try {
            const newVote = {
                ...vote,
                user_id: ObjectId(vote.user_id),
                comment_id: ObjectId(vote.comment_id)
            };
            console.log(newVote);
            const result = await comment_votes.insertOne(newVote);
            const increaseVotesResult = await CommentsDAO.changeScore(
                vote.comment_id,
                vote.vote === 1 ? 1 : -1
            );

            return result;
        } catch (e) {
            console.error(`Unable to insert comment vote into database: ${e}`);
            return { error: e };
        }
    }

    static async updateCommentVote(vote) {
        try {
            const result = await comment_votes.updateOne(
                {
                    user_id: { $eq: ObjectId(vote.user_id) },
                    comment_id: { $eq: ObjectId(vote.comment_id) }
                },
                {
                    $set: { vote: vote.vote }
                }
            );

            const updateVotesResult = await CommentsDAO.changeScore(
                vote.comment_id,
                vote.vote === 1 ? 2 : -2
            );
            
            return result;
        } catch (e) {
            console.error(`Unable to update comment vote in database: ${e}`);
            return { error: e };
        }
    }

    static async deleteCommentVote(user_id, comment_id) {
        try {
            const foundVote = await comment_votes.findOneAndDelete(
                {
                    user_id: { $eq: ObjectId(user_id) },
                    comment_id: { $eq: ObjectId(comment_id) }
                }
            );

            const deleteVoteResult = await CommentsDAO.changeScore(
                comment_id,
                foundVote.vote === 1 ? -1 : 1
            );

            return foundVote;
        } catch (e) {
            console.error(`Unable to delete comment vote in database: ${e}`);
            return { error: e };
        }
    }






    static async createPostVote(vote) {
        try {
            const newVote = {
                ...vote,
                user_id: ObjectId(vote.user_id),
                post_id: ObjectId(vote.post_id)
            }
            const result = await post_votes.insertOne(newVote);

            return result;
        } catch (e) {
            console.error(`Unable to insert post vote into database: ${e}`);
            return { error: e };
        }
    }

    static async updatePostVote(vote) {
        try {
            const result = await post_votes.updateOne(
                {
                    user_id: { $eq: ObjectId(vote.user_id) },
                    post_id: { $eq: ObjectId(post_id) }
                },
                {
                    $set: { vote: vote.vote }
                }
            );
            return result;
        } catch (e) {
            console.error(`Unable to update post vote in database: ${e}`);
            return { error: e };
        }
    }

    static async deletePostVote(vote) {
        try {
            const result = await post_votes.deleteOne(
                {
                    user_id: { $eq: ObjectId(vote.user_id) },
                    post_id: { $eq: ObjectId(post_id) }
                }
            );

            return result;
        } catch (e) {
            console.error(`Unable to delete post vote in database: ${e}`);
            return { error: e };
        }
    }


}