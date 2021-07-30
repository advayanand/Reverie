import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import commentService from './services/commentService';
import postService from './services/postService';


const CommentThread = ({ comments, commentThread, setComments, post_id, user_id }) => {
    const [ showReplyTextBox, setShowReplyTextBox ] = useState(false);
    const [ replyText, setReplyText ] = useState('');
    

    const updateCommentTree = (comments, newComment) => {
        setComments(comments.map(commentThread => updateCommentThread(commentThread, newComment)));
    }

    const updateCommentThread = (commentThread, newComment) => {
        if (commentThread._id === newComment.parent_id) {
            commentThread.childrenComments.unshift(newComment);
            return commentThread;
        }
        commentThread.childrenComments = commentThread.childrenComments.map(commentThread => {
            return updateCommentThread(commentThread, newComment);
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
        commentService
            .createComment(reply)
            .then(returnedComment => {
                returnedComment.childrenComments = [];
                console.log(returnedComment);
                updateCommentTree(comments, returnedComment);
                setShowReplyTextBox(false);
                setReplyText('');
            });
    }

    return (
        <li className='thread-container'>
            {commentThread.content}
            <button onClick={e => setShowReplyTextBox(!showReplyTextBox)}>Reply</button>
            {showReplyTextBox && (
                <>
                <input value={replyText} onChange={e => setReplyText(e.target.value)}></input>
                <button onClick={sendReply}>Send</button>
                </>
            )}
            <ul>
                {commentThread.childrenComments.map(commentThread => {
                    return <CommentThread key={commentThread._id} comments={comments} setComments={setComments} commentThread={commentThread} />
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