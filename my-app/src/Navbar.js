import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('User logged out successfully');
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <header>
            <div id="navbar">
                <img src="betterfinance.png" className="icon" alt="Logo" />
                <div className="navbar-buttons">
                    <button onClick={() => navigate("/welcome")}>Home</button>
                    <button onClick={() => navigate("/help")}>Help</button>
                    <button onClick={() => navigate("/about-us")}>About Us</button>
                    <button onClick={() => navigate("/currency-calculator")}>Currency Calculator</button>
                    <button onClick={handleLogout}>Log Out</button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;