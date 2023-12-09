import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLogin }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
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
        if (firstName && lastName && email) {
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
        <div className="log-form">
            <h2>Let's get started!</h2>
            <form>
                <div className="mb-4">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="First Name"
                        onChange={handleFirstNameChange}
                    />
                </div>

                <div className="mb-4">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Last Name"
                        onChange={handleLastNameChange}
                    />
                </div>

                <div className="mb-4">
                    <input
                        className="form-control"
                        type="email"
                        placeholder="Email Address"
                        onChange={handleEmailChange}
                    />
                    {emailError && <div className="error-message">{emailError}</div>}
                </div>

                <div className="text-center text-md-start mt-3">
                    <button className="btn" onClick={handleLogin}>
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
