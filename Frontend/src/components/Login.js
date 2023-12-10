import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import '../assets/img/iiit_logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

// This component houses the code for the Login page that allows users to login to the application.
// If needed, this component can be integrated with a backend to authenticate users.

function Login({ onLogin }) {

    // States to store the user's first name, last name and email address
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    // Functions to handle the input field changes
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

    // Function to handle the login button click
    const handleLogin = () => {
        if (firstName && lastName && email) {
            if (isEmailValid(email)) {
                // If the email address is valid, call the onLogin callback function passed from the App component
                onLogin();
            } else {
                setEmailError('Please enter a valid email address.');
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    return (
        <div>
        <div className="iiit-logo">
        <img src={require('../assets/img/iiit_logo.png') } alt="IIIT Logo" style = {
            {
                width: 250,
                height: 250,
                marginLeft: 20,
                marginTop: 500,

            }
        }/>
        </div>
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
        </div>
    );
}

export default Login;
