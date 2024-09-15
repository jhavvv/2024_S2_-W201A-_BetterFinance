/* This page was made for testing purposes and can be modified/deleted if needed */

import React from 'react';
import Navbar from './Navbar';
//nimport { useNavigate } from 'react-router-dom';

function Services() {
    //const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            
            <main>
                <h1>Services</h1>
                <p>This website is way to help track how your finances are going</p>
                <p>Each day we suggest you go into the update finance page and add what you may have spent money on and money you have earned</p>
                <p>This will allow the website to keep track of it for you and display graphs and statistics of how you've been progressing</p>
                <p>Good or bad? This website is here to help by suggesting ways to better your finances over time with tips</p>
                <p>Things like budgetting, saving up for things more, using any surplus income in investments like stocks or corporate bonds etc.</p>
            </main>
        </div>
    );
}

export default Services;
