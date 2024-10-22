import React, { useState, useEffect } from 'react';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { BarChartGraphing, PieChartCategories, PieChartEssentials } from './graphing';
import TransactionHistory from './TransactionHistory';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'; // Firestore imports
import BasicDateRangeCalendar from './BasicDateRangeCalendar.js';
import { IconButton, Popover } from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import NavButtons from './NavButtons'; // Reusable nav buttons
import { useBackgroundColor } from './BackgroundColorContext';
import NavButtons from './NavButtons';
import HamburgerMenu from './HamburgerMenu';

function WelcomePage() {
    const [userName, setUserName] = useState('');

    const [transactionDateRange, setTransactionDateRange] = useState([null, null]); // Transaction history date range
    const [essentialDateRange, setEssentialDateRange] = useState([null, null]); // Essential spending date range
    const [incomeDateRange, setIncomeDateRange] = useState([null, null]); // Income graph date range
    const [streakCount, setStreakCount] = useState(0); // Store daily streak
    const [transactionAnchorEl, setTransactionAnchorEl] = useState(null);
    const [essentialAnchorEl, setEssentialAnchorEl] = useState(null);
    const [incomeAnchorEl, setIncomeAnchorEl] = useState(null);


    function WelcomePage() {
        const [userName, setUserName] = useState('');

        const [currentMonth, setCurrentMonth] = useState(''); // State for current month
        const [totalIncome, setTotalIncome] = useState(0); // Track total income
        const [totalSpending, setTotalSpending] = useState(0); // Track total spending
        const [budget, setBudget] = useState(null); // State for budget
        const navigate = useNavigate();


        const [anchorEl, setAnchorEl] = useState(null);
        const { backgroundColor } = useBackgroundColor();

        useEffect(() => {
            console.log('Current background color:', backgroundColor);
        }, [backgroundColor]);

        useEffect(() => {
            const currentUser = auth.currentUser;

            if (currentUser) {
                setUserName(currentUser.displayName || currentUser.email);
                checkMonthlyExcessSpending(currentUser.uid);
                checkMonthlyExcessSpending(currentUser.uid); // Call the monthly check function
                fetchDailyStreak(currentUser.uid);
                fetchBudget(currentUser.uid); // Fetch budget
            }

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

            setCurrentMonth(monthNames[currentMonthIndex]);
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
                const currentMonth = new Date().getMonth() + 1;
                const currentYear = new Date().getFullYear();

                const incomeRef = collection(db, 'users', userID, 'income');
                const incomeQuery = query(
                    incomeRef,
                    where('incomeDate', '>=', `${currentYear}-${currentMonth}-01`),
                    where('incomeDate', '<=', `${currentYear}-${currentMonth}-31`)
                );
                const incomeSnapshot = await getDocs(incomeQuery);

                const totalIncomeAmount = incomeSnapshot.docs.reduce((total, doc) => total + doc.data().amount, 0);

                const spendingRef = collection(db, 'users', userID, 'spending');
                const spendingQuery = query(
                    spendingRef,
                    where('date', '>=', `${currentYear}-${currentMonth}-01`),
                    where('date', '<=', `${currentYear}-${currentMonth}-31`)
                );
                const spendingSnapshot = await getDocs(spendingQuery);

                const totalSpendingAmount = spendingSnapshot.docs.reduce((total, doc) => total + doc.data().amount, 0);

                setTotalIncome(totalIncomeAmount);
                setTotalSpending(totalSpendingAmount);

                if (totalSpendingAmount > totalIncomeAmount) {
                    console.log('Spending exceeds income for this month');
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
                {/* <Navbar /> */}

                {/* Welcome Message */}
                <div style={{ backgroundColor, minHeight: '100vh' }}>
                    <main>
                        <div className="welcome-message">
                            <h2 style={{ color: 'black' }}>Welcome {userName ? `@${userName}` : 'Guest'}!</h2>
                            <span> | Daily Streak: {streakCount} 🔥</span>
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
                        {/*<BasicDateRangeCalendar onDateRangeChange={handleDateRangeChange} />*/}
                        <div className="content-container">
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
                                
                                {/* <button onClick={() => setBackgroundColor('black')}>Dark Mode</button>
                                <button onClick={() => setBackgroundColor('white')}>Light Mode</button>
                                <button onClick={() => setBackgroundColor('#907AD6')}>Original Mode</button> */}
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
                    {/* Navigation pane */}
                    <aside className="navigation-container">
                        <label className='label-style'>Other Pages</label>
                        {/*<button onClick={() => setBackgroundColor('black')}>Dark Mode</button>
                        <button onClick={() => setBackgroundColor('white')}>Light Mode</button>
                        <button onClick={() => setBackgroundColor('#907AD6')}>Original Mode</button>*/}
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
            </div>
        );

    }
}

export default WelcomePage;
