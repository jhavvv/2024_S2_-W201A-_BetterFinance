

import React, { useState, useEffect } from 'react';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import Navbar from './Navbar';
import { LineChartGraphing, PieChartCategories, PieChartEssentials } from './graphing';
import TransactionHistory from './TransactionHistory';

function WelcomePage() {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    console.log("Current User:", auth.currentUser);


    useEffect(() => {
        const currentUser = auth.currentUser;

        // If the user is logged in, extract their display name or email
        if (currentUser) {
            setUserName(currentUser.displayName || currentUser.email);
        }
    }, []);

    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Welcome Message */}
            <main>
                <div className="welcome-message">
                    <h2>Welcome {userName ? `@${userName}` : 'Guest'}!</h2>
                </div>

                {/* Graphs */}
                <div className="content-container">
                    {/* Graphs container */}
                    <div className="graphs-container">
                        <div className="graph transaction-graph">
                            <h3 className="graph-title">Transaction History</h3>
                            {/* Graph content can go here */}
                            <TransactionHistory showOnlyList={true} />

                        </div>
                        <div className="graph recap-graph">
                            <h3 className="graph-title">Monthly Recap</h3>
                            {/* Graph content can go here */}
                            <PieChartEssentials />
                        </div>
                        <div className="graph income-graph">
                            <h3 className="graph-title">Monthly Income</h3>
                            {/* Graph content can go here */}
                            <LineChartGraphing />
                        </div>
                        <div className="graph savings-graph">
                            <h3 className="graph-title">Savings</h3>
                            {/* Graph content can go here */}
                            <PieChartCategories />
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
                        <button className="navigation-btn" onClick={() => navigate("/Infopage")}>Update Information</button>
                        <button className="navigation-btn" onClick={() => navigate("/edit-transactions")}>Edit Transactions</button>
                        
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default WelcomePage;
