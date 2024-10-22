import React, { useState, useEffect } from 'react';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { BarChartGraphing, PieChartCategories, PieChartEssentials } from './graphing';
import TransactionHistory from './TransactionHistory';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import Modal from './Modal';
import { IconButton, Popover } from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import BasicDateRangeCalendar from './BasicDateRangeCalendar';


function WelcomePage() {
    const [userName, setUserName] = useState('');
    const [currentMonth, setCurrentMonth] = useState('');
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalSpending, setTotalSpending] = useState(0);
    const [budget, setBudget] = useState(null);
    const [streakCount, setStreakCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [transactionAnchorEl, setTransactionAnchorEl] = useState(null);
    const [essentialAnchorEl, setEssentialAnchorEl] = useState(null);
    const [incomeAnchorEl, setIncomeAnchorEl] = useState(null);
    const [transactionDateRange, setTransactionDateRange] = useState([]);
    const [essentialDateRange, setEssentialDateRange] = useState([]);
    const [incomeDateRange, setIncomeDateRange] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserName(user.displayName || user.email);
                checkLastInputTime(user.uid);
                checkMonthlyExcessSpending(user.uid);
                fetchBudget(user.uid);
                fetchDailyStreak(user.uid);
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        setCurrentMonth(monthNames[new Date().getMonth()]);
    }, []);

    const checkLastInputTime = async (userID) => {
        try {
            const userDocRef = doc(db, 'users', userID);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const lastTimestamp = userDocSnapshot.data().lastInputTimestamp?.toDate();
                const now = new Date();
                const timeDifference = (now - lastTimestamp) / (1000 * 60 * 60); // Convert to hours

                if (timeDifference > 24) {
                    setShowModal(true);
                }
            }
        } catch (error) {
            console.error('Error checking last input time:', error);
        }
    };

    const fetchBudget = async (userID) => {
        try {
            const budgetRef = collection(db, 'users', userID, 'budget');
            const budgetSnapshot = await getDocs(budgetRef);
            if (!budgetSnapshot.empty) {
                const budgetData = budgetSnapshot.docs[0].data();
                setBudget(budgetData.monthlyBudget);
            }
        } catch (error) {
            console.error('Error fetching budget:', error);
        }
    };

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
            }
        } catch (error) {
            console.error('Error checking monthly excess spending:', error);
        }
    };

    const fetchDailyStreak = async (userID) => {
        try {
            const userDocRef = doc(db, 'users', userID);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setStreakCount(userDoc.data().streakCount || 0);
            }
        } catch (error) {
            console.error('Error fetching streak count:', error);
        }
    };

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

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