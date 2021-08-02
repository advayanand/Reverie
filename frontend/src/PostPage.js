import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import commentService from './services/commentService';
import postService from './services/postService';
import './PostPage.css';
import voteService from './services/voteService';


const CommentThread = ({ comments, commentThread, setComments, post_id, user_id }) => {
    const [ showReplyTextBox, setShowReplyTextBox ] = useState(false);
    const [ replyText, setReplyText ] = useState('');
    const [ showEditTextBox, setShowEditTextBox ] = useState(false);
    const [ editText, setEditText ] = useState(commentThread.content);
    const [ score, setScore ] = useState(commentThread.votes);

    const addCommentToThreads = (comments, newComment) => {
        setComments(comments.map(commentThread => addCommentToThread(commentThread, newComment)));
    }

    const addCommentToThread = (commentThread, newComment) => {
        if (commentThread._id === newComment.parent_id) {
            commentThread.childrenComments.unshift(newComment);
            return commentThread;
        }
        commentThread.childrenComments = commentThread.childrenComments.map(commentThread => {
            return addCommentToThread(commentThread, newComment);
        });
        return commentThread;
    }

    const sendReply = e => {
        const reply = {
            user_id,
            content: replyText,
            is_top_level: false,
            post_id,
            parent_id: commentThread._id
        }
        console.log(reply);
        commentService
            .createComment(reply)
            .then(returnedComment => {
                returnedComment.childrenComments = [];
                console.log(returnedComment);
                addCommentToThreads(comments, returnedComment);
                setShowReplyTextBox(false);
                setReplyText('');
            });
    }

    const updateCommentThreads = (comments, returnedComment) => {
        setComments(comments.map(commentThread => updateCommentThread(commentThread, returnedComment)));
    }

    const updateCommentThread = (commentThread, returnedComment) => {
        if (commentThread._id === returnedComment.comment_id) {
            commentThread.content = returnedComment.content;
            return commentThread;
        }
        commentThread.childrenComments = commentThread.childrenComments.map(commentThread => {
            return updateCommentThread(commentThread, returnedComment);
        });
        return commentThread;
    }

    const deleteCommentThreads = (comments, comment_id_to_delete) => {
        setComments(comments.map(commentThread => deleteCommentThread(commentThread, comment_id_to_delete)));
    }

    const deleteCommentThread = (commentThread, comment_id_to_delete) => {
        if (commentThread._id === comment_id_to_delete) {
            commentThread.deleted = true;
            return commentThread;
        }
        commentThread.childrenComments = commentThread.childrenComments.map(commentThread => {
            return deleteCommentThread(commentThread, comment_id_to_delete);
        });
        return commentThread;
    }

    const saveEdit = e => {
        const newCommentInfo = {
            user_id,
            content: editText
        };
        console.log(newCommentInfo);
        commentService
            .updateComment(commentThread._id, newCommentInfo)
            .then(returnedComment => {
                console.log(returnedComment);
                updateCommentThreads(comments, returnedComment);
                setShowEditTextBox(false);
                setEditText(returnedComment.content);
            });
    }

    const deleteComment = e => {
        commentService
            .deleteComment(commentThread._id)
            .then(data => {
                deleteCommentThreads(comments, commentThread._id);
            });
    }

    const onUpvote = e => {
        const vote = {
            user_id,
            vote: 1
        }
        voteService
            .createCommentVote(commentThread._id, vote)
            .then(data => {
                setScore(score + 1);
            });
    }

    const onDownvote = e => {
        const vote = {
            user_id,
            vote: -1
        }
        voteService
            .createCommentVote(commentThread._id, vote)
            .then(data => {
                setScore(score - 1);
            });
    }

    return (
        <li className='thread-container'>
            <div className='vote-container'>
                <button onClick={onUpvote}>up</button>
                <span className='score'>{score}</span>
                <button onClick={onDownvote}>down</button>
            </div>
            {commentThread.deleted ? '<deleted>' : commentThread.content}
            <button onClick={e => setShowReplyTextBox(!showReplyTextBox)}>Reply</button>
            {showReplyTextBox && (
                <>
                <input value={replyText} onChange={e => setReplyText(e.target.value)}></input>
                <button onClick={e => {setShowReplyTextBox(false); setReplyText('');}}>Cancel</button>
                <button onClick={sendReply}>Send</button>
                </>
            )}
            {commentThread.user_id === user_id && !commentThread.deleted && (
                <>
                <button onClick={e => setShowEditTextBox(!showEditTextBox)}>Edit</button>
                <button onClick={deleteComment}>Delete</button>
                </>
            )}
            {showEditTextBox && (
                <>
                <input value={editText} onChange={e => setEditText(e.target.value)} />
                <button onClick={saveEdit}>Save</button>
                </>
            )}
            <ul>
                {commentThread.childrenComments.map(commentThread => {
                    return <CommentThread key={commentThread._id} comments={comments} setComments={setComments} commentThread={commentThread} post_id={post_id} user_id={user_id}/>
                })}
            </ul>
        </li>
    );
}

const Comments = ({ comments, setComments, post_id, user_id }) => {
    return (
        <div className='comments-container'>
            <ul>
                {comments.map(commentThread => {
                    return <CommentThread key={commentThread._id} comments={comments} setComments={setComments} commentThread={commentThread} post_id={post_id} user_id={user_id}/>;
                })}
            </ul>
        </div>
    );
}

const Post = ({ post, setPost, addTopLevelReply, user_id }) => {
    const [ replyText, setReplyText ] = useState('');
    const [ showReplyTextBox, setShowReplyTextBox ] = useState(false);
    return (
        <div className='post'>
            <p>{post.content}</p>
            <button onClick={e => setShowReplyTextBox(!showReplyTextBox)}>Reply</button>
            {showReplyTextBox && (
                <>
                <input value={replyText} onChange={e => setReplyText(e.target.value)}></input>
                <button onClick={e => {setShowReplyTextBox(false); setReplyText('');}}>Cancel</button>
                <button onClick={e => {
                    addTopLevelReply({
                        user_id,
                        content: replyText,
                        is_top_level: true,
                        post_id: post._id,
                        parent_id: post._id
                    });
                    setShowReplyTextBox(false);
                    setReplyText('');
                }}>Send</button>
                </>
            )}
        </div>
    )
}

export default function PostPage({ token }) {
    const { post_id } = useParams();
    const [ comments, setComments ] = useState([]);
    const [ post, setPost ] = useState({});
    useEffect(() => {
        commentService
            .getAllThreads(post_id)
            .then(comments => {
                setComments(comments);
            });
        postService
            .getPost(post_id)
            .then(post => {
                setPost(post);
            });
    }, []);
    const addTopLevelReply = reply => {
        commentService
            .createComment(reply)
            .then(returnedComment => {
                returnedComment.childrenComments = [];
                console.log(returnedComment);
                setComments([returnedComment].concat(comments));
            });
    }
    return (
        <div className='post-container'>
            <Post post={post} setPost={setPost} addTopLevelReply={addTopLevelReply} user_id={token}/>
            <Comments comments={comments} setComments={setComments} post_id={post_id} user_id={token}/>
        </div>
    );
}