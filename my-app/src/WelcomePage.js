import React, { useState, useEffect } from 'react';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { BarChartGraphing, PieChartCategories, PieChartEssentials } from './graphing';
import TransactionHistory from './TransactionHistory';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Modal from './Modal';


function WelcomePage() {
    const [userName, setUserName] = useState('');
    const [currentMonth, setCurrentMonth] = useState(''); // State for current month
    const [totalIncome, setTotalIncome] = useState(0); // Track total income
    const [totalSpending, setTotalSpending] = useState(0); // Track total spending
    const [budget, setBudget] = useState(null); // State for budget
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [userID, setUserID] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                checkLastInputTime(user.uid); // Check transaction time
            }
        });

        return () => unsubscribe();
    }, []);

    const checkLastInputTime = async (userID) => {
        const userDocRef = doc(db, 'users', userID);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const lastTimestamp = userDocSnapshot.data().lastInputTimestamp;

            if (!lastTimestamp) {
                setShowModal(true);
            } else {
                const now = new Date();
                const lastTimestampDate = lastTimestamp.toDate();
                const timeDifference = (now - lastTimestampDate) / (1000 * 60 * 60); // Convert to hours

                if (timeDifference > 24) {
                    setShowModal(true);
                }
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserName(user.displayName || user.email);
                checkMonthlyExcessSpending(user.uid);
                fetchBudget(user.uid);

                // Delay the checkTimeDifference to ensure user data is ready
                setTimeout(() => {
                    checkTimeDifference(user.uid);
                }, 1000);
            } else {
                navigate('/login'); // Redirect to login if not authenticated
            }
        });

        return () => unsubscribe(); // Cleanup the listener on component unmount
    }, []);

    useEffect(() => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentMonthIndex = new Date().getMonth();
        setCurrentMonth(monthNames[currentMonthIndex]);
    }, []);

    // Check the time difference since last input
    const checkTimeDifference = async (userID) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userID));
            if (userDoc.exists()) {
                const lastInputTimestamp = userDoc.data().lastInputTimestamp?.toDate();
                console.log("Last input timestamp:", lastInputTimestamp);
                const currentTime = new Date();
                console.log("Current time:", currentTime);

                // Calculate the time difference in hours
                const timeDifference = Math.abs(currentTime - lastInputTimestamp) / 36e5;
                console.log("Time difference in hours:", timeDifference);

                if (timeDifference > 24) {
                    alert("It’s been more than 24 hours since your last update. Please update or add information.");
                } else {
                    console.log("No need to prompt, time difference is less than 24 hours.");
                }
            } else {
                console.log("User document not found");
            }
        } catch (error) {
            console.error('Error checking time difference:', error);
        }
    };


    // Function to fetch budget
    const fetchBudget = async (userID) => {
        try {
            const budgetRef = collection(db, 'users', userID, 'budget');
            const budgetSnapshot = await getDocs(budgetRef);

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
                <div className="main-container">
                    <div className="welcome-message">
                        <h2>Welcome {userName ? `@${userName}` : 'Guest'}!</h2>
                        <span> | Daily Streak: {streakCount} 🔥</span>
                    </div>

                    <div className="budget-display">
                        {budget !== null ? <h3>Your Monthly Budget: ${budget}</h3> : <h3>No Budget Set Yet</h3>}
                    </div>

                    <div className="graphs-container">
                        <div className="graph transaction-graph">
                            <h3>Transaction History</h3>
                            <IconButton onClick={() => setTransactionAnchorEl(true)}><DateRangeIcon /></IconButton>
                            <TransactionHistory dateRange={transactionDateRange} />
                        </div>

                        <div className="graph recap-graph">
                            <h3>Essential and Non-Essential Spending</h3>
                            <IconButton onClick={() => setEssentialAnchorEl(true)}><DateRangeIcon /></IconButton>
                            <PieChartEssentials dateRange={essentialDateRange} />
                        </div>

                        <div className="graph income-graph">
                            <h3>Monthly Income</h3>
                            <IconButton onClick={() => setIncomeAnchorEl(true)}><DateRangeIcon /></IconButton>
                            <BarChartGraphing dateRange={incomeDateRange} />
                        </div>

                        <div className="graph savings-graph">
                            <h3>Categories of Spending</h3>
                            <IconButton onClick={handleClick}><DateRangeIcon /></IconButton>
                            <PieChartCategories />
                        </div>
                    </div>

                    <Modal open={showModal} />
                </div>
            );
        }

export default WelcomePage;
