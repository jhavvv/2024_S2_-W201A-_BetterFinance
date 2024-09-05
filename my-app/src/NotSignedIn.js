import React from 'react';
import { useNavigate } from 'react-router-dom';
import './stylesheet.css';

const NotSignedIn = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <center>
                <h2>Welcome!</h2>
                <p>Log in or Sign up!</p>
                <div className="button-group">
                    <button className="btn" onClick={() => navigate("/login")}>Log In</button>
                    <button className="btn" onClick={() => navigate("/register")}>Sign Up</button>
                </div>
            </center>
        </div>
    );
};

export default NotSignedIn;
