/* This page was made for testing purposes and can be modified/deleted if needed */

import React from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

function Services() {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            
            <main>
                <h1>Services</h1>
            </main>
        </div>
    );
}

export default Services;
