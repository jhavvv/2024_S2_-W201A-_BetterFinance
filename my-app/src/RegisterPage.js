import React, { useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
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
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        setLoading(true); // Start loading

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false); // Stop loading on error
            return;
        }

        try {
            // Check if username exists
            const querySnapshot = await getDocs(collection(db, 'users'));
            const usernames = querySnapshot.docs.map(doc => doc.data().username);

            if (usernames.includes(username)) {
                setError("Username already exists");
                setLoading(false); // Stop loading on error
                return;
            }

            // Register user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Add user details to Firestore
            await addDoc(collection(db, 'users'), {
                uid: user.uid,
                username,
                firstName,
                lastName,
                email,
                phoneNumber
            });

            console.log("User registered and data saved:", userCredential);

            // Redirect to login page
            setLoading(false); // Stop loading
            navigate('/login');
        } catch (err) {
            setError(err.message);
            setLoading(false); // Stop loading on error
        }

    };


    return (
        <div className='register-cont'>
            <h2>Create an Account</h2>
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
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default RegisterPage;
