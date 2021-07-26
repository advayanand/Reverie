import axios from 'axios';
import config from './config';

const createUser = user => {
    return axios
        .post(config.SERVER_API_URL + '/users')
        .then(response => response.data);
}

const getUser = user_id => {
    return axios
        .get(`${config.SERVER_API_URL}/users/${user_id}`)
        .then(response => response.data);
}

const updateUser = (user_id, user) => {
    return axios
        .put(`${config.SERVER_API_URL}/users/${user_id}`, user)
        .then(response => response.data);
}

const deleteUser = (user_id) => {
    return axios
        .delete(`${config.SERVER_API_URL}/users/${user_id}`)
        .then(response => response.data);
}