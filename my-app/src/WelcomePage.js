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
        const currentUser = auth.currentUser; // Assuming you have auth defined
        if (currentUser) {
            setUserID(currentUser.uid);
            checkLastInputTime(currentUser.uid); // Check last input time when user logs in
        }
    }, []);

    const addLastInputTimestamp = async (userID, timestamp) => {
        const userDocRef = doc(db, 'users', userID);
        await setDoc(userDocRef, {
            lastInputTimestamp: timestamp
        }, { merge: true });  // Merge to avoid overwriting other fields
    };

    const checkLastInputTime = async (userID) => {
        const userDocRef = doc(db, 'users', userID);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const lastTimestamp = userData.lastInputTimestamp;

            if (!lastTimestamp) {
                // If lastInputTimestamp does not exist, show the modal
                setShowModal(true);
            } else {
                const now = new Date();
                const lastTimestampDate = lastTimestamp.toDate(); // Convert Firestore timestamp
                const timeDifference = now - lastTimestampDate;
                const hoursDifference = timeDifference / (1000 * 60 * 60);

                if (hoursDifference > 24) {
                    setShowModal(true); // Show the modal if more than 24 hours have passed
                }
            }
        } else {
            console.log('User document does not exist.');
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
            </div>
        </main>
    );

}

export default WelcomePage;
