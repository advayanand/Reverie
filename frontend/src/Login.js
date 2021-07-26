import React, { useState } from 'react';
import './styles/Login.css';

const Login = (props) => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    return (
        <div className='container'>
            <div className='left'>
                <h1>Login</h1>
                <form>
                    <input
                        placeholder='Email'
                        type='email'
                        onChange={e => setEmail(e.target.value)} />
                    <input
                        placeholder='Password'
                        type='password'
                        onChange={e => setPassword(e.target.value)} />
                    <button onClick={e => e.preventDefault()} />
                </form>
                
            </div>
            <div className='right'></div>
        </div>
    );
}

export default Login;