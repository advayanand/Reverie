import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import commentService from './services/commentService';
import postService from './services/postService';


const CommentThread = ({ commentThread }) => {
    return (
        <li className='thread-container'>
            {commentThread.content}
            <ul>
                {commentThread.childrenComments.map(commentThread => {
                    return <CommentThread key={commentThread._id} commentThread={commentThread} />
                })}
            </ul>
        </li>
    )
}

const Comments = ({ comments }) => {
    return (
        <div className='comments-container'>
            <ul>
                {comments.map(commentThread => {
                    return <CommentThread key={commentThread._id} commentThread={commentThread} />;
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
            })
    }, []);
    return (
        <div className='post-container'>
            <Post post={post} setPost={setPost}/>
            <Comments comments={comments} setComments={setComments}/>
        </div>
    );
}