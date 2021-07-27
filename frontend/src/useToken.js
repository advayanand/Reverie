import { useState } from "react";

export default function useToken() {
    const getToken = () => {
        const idString = sessionStorage.getItem('token');
        const auth_user_id = JSON.parse(idString);
        return auth_user_id;
    }

    const [ token, setToken ] = useState(getToken());

    const saveToken = userToken => {
        console.log(userToken);
        sessionStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken);
    }

    return {
        token,
        setToken: saveToken
    };
}