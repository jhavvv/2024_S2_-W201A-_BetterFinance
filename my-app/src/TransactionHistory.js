import React, { useState, useEffect, useRef } from 'react';
import './EditTransaction.css';
import './index.js';
import './stylesheet.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, getDocs } from 'firebase/firestore';

function TransactionHistory({ showOnlyList = false }) {
    const [userName, setUserName] = useState('');
    const [userID, setUserID] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('name'); // New state for sorting
    const [dropdownVisible, setDropdownVisible] = useState(false); // State to manage dropdown visibility
    const transactionListRef = useRef(null); // Create a ref for the list element
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserName(user.displayName || user.email);
                setUserID(user.uid);
            } else {
                // Handle the case when the user is not authenticated (e.g., redirect to login)
                setUserName('');
                setUserID('');
            }
        });

        // Clean up the listener on unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userID) {
            const fetchTransactions = async () => {
                try {
                    // Access the nested 'spending' subcollection for the specified user
                    const spendingCollectionRef = collection(db, 'users', userID, 'spending');

                    // Create the query
                    const q = query(spendingCollectionRef);

                    // Execute the query
                    const querySnapshot = await getDocs(q);

                    // Map the fetched documents to an array
                    const fetchedTransactions = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    console.log("Fetched transactions:", fetchedTransactions); // Debug line

                    // If showOnlyList is true, filter for current month transactions
                    if (showOnlyList) {
                        const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
                        const filteredTransactions = fetchedTransactions.filter(transaction => {
                            const transactionDate = new Date(transaction.date); // Assuming date is in a parseable format
                            return transactionDate.getMonth() + 1 === currentMonth;
                        });
                        setTransactions(filteredTransactions);
                    } else {
                        setTransactions(fetchedTransactions);
                    }
                } catch (error) {
                    console.error("Error fetching transactions: ", error);
                }
            };

            fetchTransactions();
        }
    }, [userID, showOnlyList]);

    // Function to sort transactions
    const sortTransactions = (criteria) => {
        setSortCriteria(criteria);
        const sortedTransactions = [...transactions].sort((a, b) => {
            if (criteria === 'name') {
                return a.spendingSource.localeCompare(b.spendingSource);
            } else if (criteria === 'date') {
                return new Date(a.date) - new Date(b.date);
            } else if (criteria === 'price') {
                return a.amount - b.amount;
            }
            return 0; // Default case
        });
        setTransactions(sortedTransactions);
        setDropdownVisible(false); // Close dropdown after sorting
    };

    return (
        <div>
            {!showOnlyList && <Navbar />}
            <main>
                {!showOnlyList && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1>Transaction History</h1>
                        <div style={{ position: 'relative' }}>
                            <button onClick={() => setDropdownVisible(!dropdownVisible)}>
                                Sort
                            </button>
                            {dropdownVisible && (
                                <div className="dropdown-menu" style={{ position: 'absolute', right: 0 }}>
                                    <button onClick={() => sortTransactions('name')}>Sort by Name</button>
                                    <button onClick={() => sortTransactions('date')}>Sort by Date</button>
                                    <button onClick={() => sortTransactions('price')}>Sort by Price</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <ul id="transactions-list" ref={transactionListRef}>
                    {transactions.length > 0 ? (
                        transactions.map(transaction => (
                            <li key={transaction.id} data-id={transaction.id}>
                                <span>{transaction.spendingSource}</span>
                                <span> - ${transaction.amount}, </span>
                                <span>Date: {transaction.date} </span>
                                <span>Time: {transaction.time}</span>
                            </li>
                        ))
                    ) : (
                        <p>No transactions found.</p> // Display message if no transactions
                    )}
                </ul>
            </main>
        </div>
    );
}

export default TransactionHistory;
