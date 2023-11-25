import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLogin }) {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailError('');
    };

    // Validate email address
    const isEmailValid = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    const handleLogin = () => {
        if (first_name && last_name && email) {
            if (isEmailValid(email)) {
                onLogin();
            } else {
                setEmailError('Please enter a valid email address.');
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-image-bg"></div>
            <div className="login-form">
                <h2 className="login-heading">Let's get started!</h2>
                <div className="divider d-flex align-items-center my-4"></div>

                <div className="mb-4">
                    <input className="form-control" type="first_name" placeholder="First Name" onChange={handleFirstNameChange} />
                </div>

                <div className="mb-4">
                    <input className="form-control" type="last_name" placeholder="Last Name" onChange={handleLastNameChange} />
                </div>

                <div className="mb-4">
                    <input className="form-control" type="email" placeholder="Email Address" onChange={handleEmailChange} />
                    {emailError && <div className="error-message">{emailError}</div>}
                </div>


                <div className="text-center text-md-start mt-3">
                    <button className="login-button" onClick={handleLogin}>
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;