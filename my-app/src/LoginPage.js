import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
    };

    return (
        <div className="login-cont">
            <h2>Login</h2>
            <form onSubimt={handleLogin}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
            <p>Don't have an account? <a href="#">Create one</a></p>
        </div>
    );
}

export default LoginPage;