import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import commentService from './services/commentService';
import postService from './services/postService';


const CommentThread = ({ comments, commentThread, setComments, post_id, user_id }) => {
    const [ showReplyTextBox, setShowReplyTextBox ] = useState(false);
    const [ replyText, setReplyText ] = useState('');
    const [ showEditTextBox, setShowEditTextBox ] = useState(false);
    const [ editText, setEditText ] = useState(commentThread.content);
    

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
            isTopLevel: false,
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
            })
    }

    return (
        <li className='thread-container'>
            {commentThread.deleted ? '<deleted>' : commentThread.content}
            <button onClick={e => setShowReplyTextBox(!showReplyTextBox)}>Reply</button>
            {showReplyTextBox && (
                <>
                <input value={replyText} onChange={e => setReplyText(e.target.value)}></input>
                <button onClick={e => {setShowReplyTextBox(false); setReplyText('');}}>Cancel</button>
                <button onClick={sendReply}>Send</button>
                </>
            )}
            {commentThread.user_id === user_id && (
                <>
                <button onClick={e => setShowEditTextBox(!showEditTextBox)}>Edit</button>
                {!commentThread.deleted && <button onClick={deleteComment}>Delete</button>}
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

const Post = ({ post, setPost }) => {
    return (
        <div className='post'>
            <p>{post.content}</p>
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
                console.log(comments);
                setComments(comments);
            });
        postService
            .getPost(post_id)
            .then(post => {
                console.log(post);
                setPost(post);
            });
    }, []);
    return (
        <div className='post-container'>
            <Post post={post} setPost={setPost} user_id={token}/>
            <Comments comments={comments} setComments={setComments} post_id={post_id} user_id={token}/>
        </div>
    );
}