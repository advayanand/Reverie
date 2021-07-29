import axios from 'axios';
import config from './config';

const createPost = post => {
    return axios
        .post(config.SERVER_API_URL + '/posts', post)
        .then(response => response.data);
}

const getPost = post_id => {
    return axios
        .get(`${config.SERVER_API_URL}/posts/${post_id}`)
        .then(response => response.data);
}

const updatePost = (post_id, post) => {
    return axios
        .put(`${config.SERVER_API_URL}/posts/${post_id}`, post)
        .then(response => response.data);
}

const deletePost = (post_id) => {
    return axios
        .delete(`${config.SERVER_API_URL}/posts/${post_id}`)
        .then(response => response.data);
}

const getPostsForUser = (user_id) => {
    return axios
        .get(`${config.SERVER_API_URL}/posts`, {
            params: {
                user_id
            }
        })
        .then(response => response.data);
}

export default {
    createPost,
    getPost,
    updatePost,
    deletePost,
    getPostsForUser
};