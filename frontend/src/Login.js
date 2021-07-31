import React, { useState } from 'react';
import userService from './services/userService';
import './styles/Login.css';

const Login = (props) => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const loginUser = user => {
        return userService.loginUser(user);
    }

    // process the login request
    const handleSubmit = async e => {
        e.preventDefault();
        // user = utils.validate(email, password);
        // if (!user) {
        //     // login failed
        // }
        console.log('in handle submit');
        const token = await loginUser({
            email,
            pwd: password
        });

        if (token.user_id === null) {
            setEmail('');
            setPassword('');
            return;
            
            // TODO - show incorrect login error
            // setInvalidLoginError(true);
        }

        props.setToken(token.user_id);
    }

    return (
        <div className='container'>
            <div className='left'>
                <h1>Welcome Back!</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        placeholder='Email'
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                    <input
                        placeholder='Password'
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)} />
                    <button type='submit'>
                        Login
                    </button>
                </form>
                
            </div>
            <div className='right'></div>
        </div>
    );
}

export default Login;