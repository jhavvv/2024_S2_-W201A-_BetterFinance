import React, { useState, useEffect } from 'react';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import Navbar from './Navbar';
import { BarChartGraphing, PieChartCategories, PieChartEssentials } from './graphing';
import TransactionHistory from './TransactionHistory';

function WelcomePage() {
    const [userName, setUserName] = useState('');
    const [currentMonth, setCurrentMonth] = useState(''); // State for current month
    const navigate = useNavigate();
    const [backgroundColor, setBackgroundColor] = useState(); // Background color state

    useEffect(() => {
        const currentUser = auth.currentUser;

        // If the user is logged in, extract their display name or email
        if (currentUser) {
            setUserName(currentUser.displayName || currentUser.email);
        }

        // Get the current month name
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentMonthIndex = new Date().getMonth(); // Get the current month (0-11)
        setCurrentMonth(monthNames[currentMonthIndex]); // Set the month name
    }, []);

    return (
        <div className="main-container" style={{ backgroundColor: backgroundColor || '#907AD6', minHeight: '100vh'  }}>
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
                            <h3 className="graph-title">Transaction History for {currentMonth}</h3>
                            {/* Graph content can go here */}
                            <TransactionHistory showOnlyList={true} />
                        </div>
                        
                        <div className="graph recap-graph">
                            <h3 className="graph-title">Essential and Non-Essential Spending for {currentMonth}</h3>
                            {/* Graph content can go here */}
                            <PieChartEssentials />
                        </div>
                        
                        <div className="graph income-graph">
                            <h3 className="graph-title">Monthly Income for {currentMonth}</h3>
                            {/* Graph content can go here */}
                            <BarChartGraphing />
                        </div>
                        
                        <div className="graph savings-graph">
                            <h3 className="graph-title">Savings</h3>
                            {/* Graph content can go here */}
                            <PieChartCategories />
                        </div>
                    </div>

                    {/* Navigation pane */}
                    <aside className="navigation-container">
                        {/* Navigation buttons */}
                        <label className='label-style'>Other Pages</label>
                        <button onClick={() => setBackgroundColor('black')}>Dark Mode</button>
                        <button onClick={() => setBackgroundColor('white')}>Light Mode</button>
                        <button onClick={() => setBackgroundColor('#907AD6')}>Original Mode</button>
                        <button className="navigation-btn" onClick={() => navigate("/edit-profile")}>Edit Profile</button>
                        <button className="navigation-btn" onClick={() => navigate("/EditDashboard")}>Edit Dashboard</button>
                        <button className="navigation-btn" onClick={() => navigate("/monthly-recap")}>Monthly Recap</button>
                        <button className="navigation-btn" onClick={() => navigate("/transaction-history")}>Transaction History</button>
                        <button className="navigation-btn" onClick={() => navigate("/monthly-income")}>Monthly Income</button>
                        <button className="navigation-btn" onClick={() => navigate("/savings")}>Savings</button>
                        <button className="navigation-btn" onClick={() => navigate("/Infopage")}>Update Information</button>
                        <button className="navigation-btn" onClick={() => navigate("/edit-transactions")}>Edit Transactions</button>
                        <button className="navigation-btn" onClick={() => navigate("/delete-transactions")}>Delete Transactions</button>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default WelcomePage;
