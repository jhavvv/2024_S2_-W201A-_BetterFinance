import React, { useState, useEffect } from 'react';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase'; // Import Firestore
import Navbar from './Navbar';
import { BarChartGraphing, PieChartCategories, PieChartEssentials } from './graphing';
import TransactionHistory from './TransactionHistory';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Firestore imports
import NavButtons from './NavButtons'; // Reusable nav buttons

function WelcomePage() {
    const [userName, setUserName] = useState('');
    const [currentMonth, setCurrentMonth] = useState(''); // State for current month
    const [totalIncome, setTotalIncome] = useState(0); // Track total income
    const [totalSpending, setTotalSpending] = useState(0); // Track total spending
    const [budget, setBudget] = useState(null); // State for budget
    const navigate = useNavigate();
    const [backgroundColor, setBackgroundColor] = useState(); // Background color state

    useEffect(() => {
        const currentUser = auth.currentUser;

        if (currentUser) {
            setUserName(currentUser.displayName || currentUser.email);
            checkMonthlyExcessSpending(currentUser.uid); // Call the monthly check function
            fetchBudget(currentUser.uid); // Fetch budget
        }

        // Get the current month name
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentMonthIndex = new Date().getMonth(); // Get the current month (0-11)
        setCurrentMonth(monthNames[currentMonthIndex]); // Set the month name
    }, []);

    // Function to fetch budget
    const fetchBudget = async (userID) => {
        try {
            const budgetRef = collection(db, 'users', userID, 'budget');
            const budgetSnapshot = await getDocs(budgetRef);

            if (!budgetSnapshot.empty) {
                const budgetData = budgetSnapshot.docs[0].data();
                setBudget(budgetData.monthlyBudget); // Set budget state
            }
        } catch (error) {
            console.error('Error fetching budget:', error);
        }
    };

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
        <div className="main-container" style={{ backgroundColor: backgroundColor || '#907AD6', minHeight: '100vh'  }}>
            {/* Navbar */}
            <Navbar />

            {/* Welcome Message */}
            <main>
                <div className="welcome-message">
                    <h2>Welcome {userName ? `@${userName}` : 'Guest'}!</h2>
                </div>

                {/* Budget Display */}
                <div className="budget-display">
                    {budget !== null ? (
                        <h3>Your Monthly Budget: ${budget}</h3>
                    ) : (
                        <h3>No Budget Set Yet - Enter It Here</h3>
                    )}
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
                            <h3 className="graph-title">Spending by Categories</h3>
                            <PieChartCategories />
                        </div>
                    </div>

                    {/* Navigation pane */}
                    <aside className="navigation-container">
                        <label className='label-style'>Other Pages</label>
                        <button onClick={() => setBackgroundColor('black')}>Dark Mode</button>
                        <button onClick={() => setBackgroundColor('white')}>Light Mode</button>
                        <button onClick={() => setBackgroundColor('#907AD6')}>Original Mode</button>
                        <NavButtons 
                            cssName='navigation-btn'
                            navigate={() => navigate('/edit-profile')}
                            text='Edit Profile'
                        />
                        <NavButtons 
                            cssName='navigation-btn'
                            navigate={() => navigate('/monthly-recap')}
                            text='Monthly Recap'
                        />
                        <NavButtons 
                            cssName='navigation-btn'
                            navigate={() => navigate('/transaction-history')}
                            text='Transaction History'
                        />
                        <NavButtons 
                            cssName='navigation-btn'
                            navigate={() => navigate('/monthly-income')}
                            text='Monthly Income'
                        />
                        <NavButtons 
                            cssName='navigation-btn'
                            navigate={() => navigate('/savings')}
                            text='Savings'
                        />
                        <NavButtons 
                            cssName='navigation-btn'
                            navigate={() => navigate('/BudgetGoal')}
                            text='Set up a budget goal'
                        />
                        <NavButtons 
                            cssName='navigation-btn'
                            navigate={() => navigate('/Infopage')}
                            text='Update Information'
                        />
                        <NavButtons 
                            cssName='navigation-btn'
                            navigate={() => navigate('/edit-transactions')}
                            text='Edit Transactions'
                        />
                        <NavButtons 
                            cssName='navigation-btn'
                            navigate={() => navigate('/delete-transactions')}
                            text='Delete Transactions'
                        />
                        <NavButtons 
                            cssName='navigation-btn'
                            navigate={() => navigate('/articles')}
                            text='Articles'
                        />

                    </aside>
                </div>
            </main>
        </div>
    );
}

export default WelcomePage;
