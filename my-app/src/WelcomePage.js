import React, { useState, useEffect } from 'react';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase'; // Import Firestore
import Navbar from './Navbar';
import { BarChartGraphing, PieChartCategories, PieChartEssentials } from './graphing';
import TransactionHistory from './TransactionHistory';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'; // Firestore imports
import BasicDateRangeCalendar from './BasicDateRangeCalendar.js';
import { IconButton, Popover } from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import NavButtons from './NavButtons'; // Reusable nav buttons

function WelcomePage() {
    const [userName, setUserName] = useState('');
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalSpending, setTotalSpending] = useState(0);
    const [transactionDateRange, setTransactionDateRange] = useState([null, null]); // Transaction history date range
    const [essentialDateRange, setEssentialDateRange] = useState([null, null]); // Essential spending date range
    const [incomeDateRange, setIncomeDateRange] = useState([null, null]); // Income graph date range
    const [streakCount, setStreakCount] = useState(0); // Store daily streak
    const [transactionAnchorEl, setTransactionAnchorEl] = useState(null);
    const [essentialAnchorEl, setEssentialAnchorEl] = useState(null);
    const [incomeAnchorEl, setIncomeAnchorEl] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState(); // Background color state
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const currentUser = auth.currentUser;

        if (currentUser) {
            setUserName(currentUser.displayName || currentUser.email);
            checkMonthlyExcessSpending(currentUser.uid); // Call the monthly check function
            fetchDailyStreak(currentUser.uid);
        }

        // Get the current month name
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentMonthIndex = new Date().getMonth(); // Get the current month (0-11)
        //setCurrentMonth(monthNames[currentMonthIndex]); // Set the month name
        // Set default date range to current month for each graph
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setTransactionDateRange([firstDayOfMonth, lastDayOfMonth]);
        setEssentialDateRange([firstDayOfMonth, lastDayOfMonth]);
        setIncomeDateRange([firstDayOfMonth, lastDayOfMonth]);
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);  // Set the anchor element to the clicked icon
    };

    const handleClose = () => {
        setAnchorEl(null);  // Close the popover
    };

    const open = Boolean(anchorEl);  // Check if the popover is open
    const id = open ? 'date-range-popover' : undefined;  // Optional ID for accessibility


    // Handle opening date range popovers
    const handleTransactionClick = (event) => {
        setTransactionAnchorEl(event.currentTarget);
    };

    const handleEssentialClick = (event) => {
        setEssentialAnchorEl(event.currentTarget);
    };

    const handleIncomeClick = (event) => {
        setIncomeAnchorEl(event.currentTarget);
    };

    // Handle closing popovers
    const handleTransactionClose = () => setTransactionAnchorEl(null);
    const handleEssentialClose = () => setEssentialAnchorEl(null);
    const handleIncomeClose = () => setIncomeAnchorEl(null);

    // Handle date range changes
    const handleTransactionDateRangeChange = (range) => setTransactionDateRange(range);
    const handleEssentialDateRangeChange = (range) => setEssentialDateRange(range);
    const handleIncomeDateRangeChange = (range) => setIncomeDateRange(range);


    //const open = Boolean(anchorEl);  // Check if the popover is open

    //const id = open ? 'date-range-popover' : undefined;  // Optional ID for accessibility

    const fetchDailyStreak = async (userID) => {
        try {
            const userDocRef = doc(db, 'users', userID);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const data = userDoc.data();
                setStreakCount(data.streakCount || 0); // Set streak count, default to 0 if not present
            }
        } catch (error) {
            console.error('Error fetching streak count:', error);
        }
    };


    const formatDateRange = (range) => {
        if (range[0] && range[1]) {
            return `${range[0].toLocaleDateString()} to ${range[1].toLocaleDateString()}`;
        } else {
            return 'This Month (default)';
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
        <div className="main-container" style={{ backgroundColor: backgroundColor || '#907AD6', minHeight: '100vh' }}>
            {/* Navbar */}
            <Navbar />

            {/* Welcome Message */}
            <main>
                <div className="welcome-message">
                    <h2 style={{ color: 'black' }}>Welcome {userName ? `@${userName}` : 'Guest'}!</h2>
                    <span> | Daily Streak: {streakCount} 🔥</span>
                </div>

                {/* Graphs */}
                {/*<BasicDateRangeCalendar onDateRangeChange={handleDateRangeChange} />*/}
                <div className="content-container">
                    {/* Graphs container */}
                    <div className="graphs-container">
                        <div className="graph transaction-graph">
                            <h3 className="graph-title">Transaction History</h3>
                            <IconButton onClick={handleTransactionClick}>
                                <DateRangeIcon />
                            </IconButton>

                            <Popover
                                open={Boolean(transactionAnchorEl)}
                                anchorEl={transactionAnchorEl}
                                onClose={handleTransactionClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <BasicDateRangeCalendar onDateRangeChange={handleTransactionDateRangeChange} />
                            </Popover>
                            <TransactionHistory showOnlyList={true} dateRange={transactionDateRange} />
                            <p className="date-range-display">{formatDateRange(transactionDateRange)}</p>
                        </div>

                        {/* Essential and Non-Essential Spending Graph */}
                        <div className="graph recap-graph">
                            <h3 className="graph-title">Essential and Non-Essential Spending</h3>
                            <IconButton onClick={handleEssentialClick}>
                                <DateRangeIcon />
                            </IconButton>

                            <Popover
                                open={Boolean(essentialAnchorEl)}
                                anchorEl={essentialAnchorEl}
                                onClose={handleEssentialClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <BasicDateRangeCalendar onDateRangeChange={handleEssentialDateRangeChange} />
                            </Popover>
                            <PieChartEssentials dateRange={essentialDateRange} />
                            <p className="date-range-display">{formatDateRange(essentialDateRange)}</p>
                        </div>

                        {/* Monthly Income Graph */}
                        <div className="graph income-graph">
                            <h3 className="graph-title">Monthly Income</h3>
                            <IconButton onClick={handleIncomeClick}>
                                <DateRangeIcon />
                            </IconButton>

                            <Popover
                                open={Boolean(incomeAnchorEl)}
                                anchorEl={incomeAnchorEl}
                                onClose={handleIncomeClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <BasicDateRangeCalendar onDateRangeChange={handleIncomeDateRangeChange} />
                            </Popover>
                            <BarChartGraphing dateRange={incomeDateRange} />
                            <p className="date-range-display">{formatDateRange(incomeDateRange)}</p>
                        </div>
                        <div className="graph savings-graph">
                            <h3 className="graph-title">Categories of Spending</h3>
                            {/* Icon that opens the date range picker */}
                            <IconButton onClick={handleClick}>
                                <DateRangeIcon />
                            </IconButton>
                            {/* Popover containing the date range picker */}

                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}  // This is the element the popover is anchored to 
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',  // Position the popover below the icon 
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',  // Align the popover's top to the icon's bottom 
                                    horizontal: 'center',
                                }}>

                                {/* Date range calendar inside the popover */}
                                <BasicDateRangeCalendar onDateRangeChange={handleIncomeDateRangeChange} />
                            </Popover>
                            <PieChartCategories />
                            <p className="date-range-display">{formatDateRange(incomeDateRange)}</p>
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
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default WelcomePage;
