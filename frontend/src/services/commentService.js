import axios from 'axios';
import config from './config';

const createComment = comment => {
    return axios
        .comment(config.SERVER_API_URL + '/comments')
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