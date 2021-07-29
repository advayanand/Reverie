import React, { useEffect, useState } from 'react';
import './styles/Home.css';
import postService from './services/postService';

const Post = (props) => {
    return (
        <li>
            <span>{props.post.content}</span>
        </li>
    )
}

const Feed = (props) => {

    return (
        <ul>
            {props.posts.map(post => <Post key={post._id} post={post} />)}
        </ul>
    );
}



const NewPostTextBox = (props) => {
    const [ content, setContent ] = useState('');

    const handleClick = e => {
        console.log(props.userId, content);
        e.preventDefault();
        const post = {
            user_id: props.userId,
            content
        };
        postService
            .createPost(post)
            .then(returnedPost => {
                props.setPosts([returnedPost].concat(props.posts));
            });
        
        
    }

    return (
        <div className='new-post' >
            <form>
                <input className='new-post-text-input' value={content} onChange={e => setContent(e.target.value)} />
                <button onClick={handleClick} />
            </form>
        </div>
    );
}

export default function Home({ token }) {
    const [ posts, setPosts ] = useState([]);

    useEffect(() => {
        postService
            .getPostsForUser(token)
            .then(data => {
                console.log(data);
                setPosts(data.posts);
            });
    }, []);

    return (
        <div>
            <h1>Home Page</h1>
            
            {/* <Header /> */}
            <NewPostTextBox userId={token} posts={posts} setPosts={setPosts}/>
            <Feed userId={token} posts={posts} />
            {/* <Footer /> */}
            
        </div>
    );
}