/* Written by Ijaz */

import React from 'react';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
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

            {/* Graphs */}
            <main>
                <div className="content-container">
                    {/* Graphs container */}
                    <div className="graphs-container">
                        <div className="graph transaction-graph">
                            <h3 className="graph-title">Transaction History</h3>
                            {/* Graph content can go here */}
                        </div>
                        <div className="graph recap-graph">
                            <h3 className="graph-title">Monthly Recap</h3>
                            {/* Graph content can go here */}
                        </div>
                        <div className="graph income-graph">
                            <h3 className="graph-title">Monthly Income</h3>
                            {/* Graph content can go here */}
                        </div>
                        <div className="graph savings-graph">
                            <h3 className="graph-title">Savings</h3>
                            {/* Graph content can go here */}
                        </div>
                    </div>

                {/* Navigation pane */}
                <aside className="navigation-container">
                    {/* This is a fixed image for testing purposes */}
                    <img src="/profile.jpg" alt="Profile" className="profile-pic" />
                    {/* Navigation buttons */}
                    <button className="navigation-btn" onClick={() => navigate("/edit-profile")}>Edit Profile</button>
                    <button className="navigation-btn" onClick={() => navigate("/monthly-recap")}>Monthly Recap</button>
                    <button className="navigation-btn" onClick={() => navigate("/transaction-history")}>Transaction History</button>
                    <button className="navigation-btn" onClick={() => navigate("/monthly-income")}>Monthly Income</button>
                    <button className="navigation-btn" onClick={() => navigate("/savings")}>Savings</button>
                </aside>
                </div>
            </main>
        </div>
    );
}

export default WelcomePage;
