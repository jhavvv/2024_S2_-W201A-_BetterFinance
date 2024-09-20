import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import './stylesheet.css';
import landingBackground from './assets/LandingBackground.jpg';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email and Password are required');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in:', userCredential.user);

            navigate('/welcome');
        }
        catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='title-cont' style={{ backgroundImage: `url(${landingBackground})` }}>
            <div className="form-container">
                <center>
                    <div className="login-box">
                        <h3>Login</h3>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                />
                            </div>
                            <button type="submit">Login</button>
                        </form>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button onClick={() => navigate('/RegisterPage')}>Create an account</button>
                    </div>
                </center>
            </div>
        </div>
    );

};

export default LoginPage;