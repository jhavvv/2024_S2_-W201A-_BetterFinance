/* This page was made for testing purposes and can be modified/deleted if needed */

import React from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

function AboutUs() {
    const navigate = useNavigate();
    return (
        <div>
            <Navbar />
            
            <main>
                <h1>About Us</h1>
            </main>
        </div>
    );
}

export default AboutUs;