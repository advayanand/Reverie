import axios from 'axios';
import config from './config';

const createComment = comment => {
    return axios
        .post(config.SERVER_API_URL + '/comments', comment)
        .then(response => response.data);
}

const getComment = comment_id => {
    return axios
        .get(`${config.SERVER_API_URL}/comments/${comment_id}`)
        .then(response => response.data);
}

const updateComment = (comment_id, comment) => {
    return axios
        .put(`${config.SERVER_API_URL}/comments/${comment_id}`, comment)
        .then(response => response.data);
}

const deleteComment = (comment_id) => {
    return axios
        .delete(`${config.SERVER_API_URL}/comments/${comment_id}`)
        .then(response => response.data);
}

const getAllThreads = (user_id, post_id) => {

    return axios
        .get(`${config.SERVER_API_URL}/posts/${post_id}/threads?u=${user_id}`)
        .then(response => response.data);
}

export default {
    createComment,
    getComment,
    updateComment,
    deleteComment,
    getAllThreads
}