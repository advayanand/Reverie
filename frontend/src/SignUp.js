import React, { useState } from 'react';
import userService from './services/userService';

const SignUp = (props) => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ name, setName ] = useState('');
    const [ handle, setHandle ] = useState('');
    const [ bio, setBio ] = useState('');

    const validateAndSubmit = e => {
        e.preventDefault();
        console.log(name);
        console.log(handle);
        console.log(bio);
        userService.createUser(
            {
                name,
                handle,
                bio
            }
        );
        
    }

    return (
        <div className='container'>
            <div className='left'>
                <h1>Welcome to Reverie!</h1>
                <form>
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
                    <input
                        placeholder='Confirm Password'
                        type='password'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)} />
                    <input
                        placeholder='Name'
                        type='text'
                        value={name}
                        onChange={e => setName(e.target.value)} />
                    <input
                        placeholder='Handle'
                        type='text'
                        value={handle}
                        onChange={e => setHandle(e.target.value)} />
                    <input
                        placeholder='Bio'
                        type='text'
                        value={bio}
                        onChange={e => setBio(e.target.value)} />
                    
                    <input type='checkbox' />
                    <p>I agree to the terms and conditions</p>
                    
                    <button onClick={validateAndSubmit} >
                        Sign Up
                    </button>
                </form>
                
            </div>
            <div className='right'></div>
        </div>
    );
}

export default SignUp;
