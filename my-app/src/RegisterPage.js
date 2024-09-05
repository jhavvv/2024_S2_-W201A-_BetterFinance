import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false); // Success state
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            console.log("Checking if username exists...");
            // Check if the username exists
            const usersRef = collection(db, 'users');
            const usernameQuery = query(usersRef, where('username', '==', username));
            const querySnapshot = await getDocs(usernameQuery);

            if (!querySnapshot.empty) {
                setError("Username already exists");
                setLoading(false);
                return;
            }

            console.log("Registering user...");
            // Register user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log("User registered, adding details to Firestore...");
            // Add user details to Firestore
            await addDoc(usersRef, {
                uid: user.uid,
                username,
                firstName,
                lastName,
                email,
                phoneNumber
            });

            console.log("User registered and data saved:", userCredential);

            // Show success message
            setSuccess(true);
            setLoading(false);
        } catch (err) {
            console.error("Error during registration:", err); // Log error to console
            setError(err.message);
            setLoading(false);
        }
    };

    // Handle proceed to login
    const handleProceedToLogin = () => {
        console.log("Navigating to login page...");
        navigate('/login');
    };

    return (
        <div className='register-cont'>
            <h2>Create an Account</h2>
            {!success ? (
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>First Name:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number:</label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="register-button" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            ) : (
                <div className="success-message">
                    <p>Successfully registered!</p>
                    <button onClick={handleProceedToLogin} className="proceed-button">
                        Proceed to login with new account
                    </button>
                </div>
            )}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default RegisterPage;
