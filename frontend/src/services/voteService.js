import axios from 'axios';
import config from './config';

const createCommentVote = (comment_id, vote) => {
    return axios
        .post(`${config.SERVER_API_URL}/comments/${comment_id}/vote`, vote)
        .then(response => response.data);
}

// const getCommentVote = vote_id => {
//     return axios
//         .get(`${config.SERVER_API_URL}/votes/${vote_id}`)
//         .then(response => response.data);
// }

const updateCommentVote = (comment_id, vote) => {
    return axios
        .put(`${config.SERVER_API_URL}/comments/${comment_id}/vote`, vote)
        .then(response => response.data);
}

const deleteCommentVote = (user_id, comment_id) => {
    return axios
        .delete(`${config.SERVER_API_URL}/comments/${comment_id}/vote?user_id=${user_id}`)
        .then(response => response.data);
}


const createPostVote = (post_id, vote) => {
    return axios
        .post(`${config.SERVER_API_URL}/posts/${post_id}/vote`, vote)
        .then(response => response.data);
}

const updatePostVote = (post_id, vote) => {
    return axios
        .put(`${config.SERVER_API_URL}/posts/${post_id}/vote`, vote)
        .then(response => response.data);
}

const deletePostVote = (user_id, post_id) => {
    return axios
        .delete(`${config.SERVER_API_URL}/posts/${post_id}/vote?user_id=${user_id}`)
        .then(response => response.data);
}

export default {
    createCommentVote,
    // getCommentVote,
    updateCommentVote,
    deleteCommentVote,
    createPostVote,
    updatePostVote,
    deletePostVote
}