import React, { useState, useEffect } from 'react';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase'; // Import Firestore
import Navbar from './Navbar';
import { BarChartGraphing, PieChartCategories, PieChartEssentials } from './graphing';
import TransactionHistory from './TransactionHistory';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Firestore imports

function WelcomePage() {
    const [userName, setUserName] = useState('');
    const [currentMonth, setCurrentMonth] = useState(''); // State for current month
    const [totalIncome, setTotalIncome] = useState(0); // Track total income
    const [totalSpending, setTotalSpending] = useState(0); // Track total spending
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = auth.currentUser;

        if (currentUser) {
            setUserName(currentUser.displayName || currentUser.email);
            checkMonthlyExcessSpending(currentUser.uid); // Call the monthly check function
        }

        // Get the current month name
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentMonthIndex = new Date().getMonth(); // Get the current month (0-11)
        setCurrentMonth(monthNames[currentMonthIndex]); // Set the month name
    }, []);

    // Function to check if total spending exceeds total income for the current month
    const checkMonthlyExcessSpending = async (userID) => {
        try {
            const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
            const currentYear = new Date().getFullYear();

            // Query user's income for the current month
            const incomeRef = collection(db, 'users', userID, 'income');
            const incomeQuery = query(incomeRef, where('incomeDate', '>=', `${currentYear}-${currentMonth}-01`), where('incomeDate', '<=', `${currentYear}-${currentMonth}-31`));
            const incomeSnapshot = await getDocs(incomeQuery);

            let totalIncomeAmount = 0;
            incomeSnapshot.forEach(doc => {
                totalIncomeAmount += doc.data().amount;
            });

            // Query user's spending for the current month
            const spendingRef = collection(db, 'users', userID, 'spending');
            const spendingQuery = query(spendingRef, where('date', '>=', `${currentYear}-${currentMonth}-01`), where('date', '<=', `${currentYear}-${currentMonth}-31`));
            const spendingSnapshot = await getDocs(spendingQuery);

            let totalSpendingAmount = 0;
            spendingSnapshot.forEach(doc => {
                totalSpendingAmount += doc.data().amount;
            });

            setTotalIncome(totalIncomeAmount); // Update total income state
            setTotalSpending(totalSpendingAmount); // Update total spending state

            // Check if spending exceeds income
            if (totalSpendingAmount > totalIncomeAmount) {
                console.log('Spending exceeds income for this month');
                // You can add a notification, alert, or UI indicator here if needed
            } else {
                console.log('Spending is within income limits for this month');
            }
        } catch (error) {
            console.error('Error checking monthly excess spending:', error);
        }
    };

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
                            <h3 className="graph-title">Transaction History for {currentMonth}</h3>
                            <TransactionHistory showOnlyList={true} />
                        </div>
                        
                        <div className="graph recap-graph">
                            <h3 className="graph-title">Essential and Non-Essential Spending for {currentMonth}</h3>
                            <PieChartEssentials />
                        </div>
                        
                        <div className="graph income-graph">
                            <h3 className="graph-title">Monthly Income for {currentMonth}</h3>
                            <BarChartGraphing />
                        </div>
                        
                        <div className="graph savings-graph">
                            <h3 className="graph-title">Savings</h3>
                            <PieChartCategories />
                        </div>
                    </div>

                    {/* Navigation pane */}
                    <aside className="navigation-container">
                        <label className='label-style'>Other Pages</label>
                        <button className="navigation-btn" onClick={() => navigate("/edit-profile")}>Edit Profile</button>
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
