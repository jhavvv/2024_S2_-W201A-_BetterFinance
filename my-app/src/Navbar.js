import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import NavButtons from './NavButtons';  // Ensure this path is correct

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
                    <NavButtons cssName="nav-button" navigate={() => navigate("/welcome")} text="Home" />
                    <NavButtons cssName="nav-button" navigate={() => navigate("/help")} text="Help" />
                    <NavButtons cssName="nav-button" navigate={() => navigate("/about-us")} text="About Us" />
                    <NavButtons cssName="nav-button" navigate={() => navigate("/articles")} text="Find Articles" />
                    <NavButtons cssName="nav-button" navigate={() => navigate("/currency-calculator")} text="Currency Calculator" />
                    <NavButtons cssName="nav-button" navigate={handleLogout} text="Log Out" />
                </div>
            </div>
        </header>
    );
}

export default Navbar;
