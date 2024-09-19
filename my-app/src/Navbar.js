/* Written by Ijaz */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();

    return (
        <header>
            <div id="navbar">
                <img src="betterfinance.png" className="icon" alt="Logo" 
                    width="3000"
                    height="3000"
                />
                <button onClick={() => navigate("/welcome")}>Home</button>
                <button onClick={() => navigate("/services")}>Services</button>
                <button onClick={() => navigate("/about-us")}>About Us</button>
                <button onClick={() => navigate("/")}>Landing Page</button>
            </div>
        </header>
    );
}

export default Navbar;
