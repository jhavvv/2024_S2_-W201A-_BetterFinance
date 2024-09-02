/* This page was made for testing purposes and can be modified/deleted if needed */

import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

function Services() {
    const navigate = useNavigate();

    return (
        <div>
            {/* Navbar */}
            <header>
                <div id="navbar">
                    <button onClick={() => navigate("/welcome-page")}>Home</button>
                    <button onClick={() => navigate("/services")}>Services</button>
                    <button onClick={() => navigate("/about-us")}>About Us</button>
                </div>
            </header>
            <h1>Services Page</h1>
            {/* Content for Services page */}
        </div>
    );
}

export default Services;
