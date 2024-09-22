/* Not functional yet, code is the same as Edit Transactions because I'm using it as a starting point -Ijaz */

import React, { useState, useEffect } from 'react';
import './EditTransaction.css';
import './index.js';
import './stylesheet.css';
import Navbar from './Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

function DeleteTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [selectedTransactionId, setSelectedTransactionId] = useState(''); // Track the selected transaction
    const [spending, setSpending] = useState('');
    const [spendingAmount, setSpendingAmount] = useState('');
    const [spendingFrequency, setSpendingFrequency] = useState('');
    const [essentiality, setEssentiality] = useState('');
    const [category, setCategory] = useState('');
    const [spendingDate, setSpendingDate] = useState('');
    const [spendingTime, setSpendingTime] = useState('');
    const [userID, setUserID] = useState('');
    const navigate = useNavigate();
    const { transactionId } = useParams();

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserID(currentUser.uid);
            fetchTransactions(currentUser.uid);
            if (transactionId) {
                fetchTransactionData(currentUser.uid, transactionId);
            }
        }
    }, [transactionId]);

    const fetchTransactions = async (userID) => {
        try {
            const querySnapshot = await getDocs(collection(db, 'users', userID, 'spending'));
            const transactionsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTransactions(transactionsList);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const fetchTransactionData = async (userID, transactionId) => {
        try {
            const userDocRef = doc(db, 'users', userID, 'spending', transactionId);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log('Fetched transaction data:', data);

                setSpending(data.spendingSource);
                setSpendingAmount(data.amount);
                setSpendingFrequency(data.frequency);
                setEssentiality(data.essentiality);
                setCategory(data.category);
                setSpendingDate(data.date);
                setSpendingTime(data.time);
            } else {
                console.error('No such document!');
            }
        } catch (error) {
            console.error('Error fetching transaction data:', error);
        }
    };

    const handleTransactionSelect = (event) => {
        const selectedId = event.target.value;
        setSelectedTransactionId(selectedId); // Update the selected transaction ID
    
        const selectedTransaction = transactions.find(transaction => transaction.id === selectedId);
        if (selectedTransaction) {
            // Make sure the data keys match the structure from Firestore
            setSpending(selectedTransaction.spendingSource || ''); 
            setSpendingAmount(selectedTransaction.amount || ''); 
            setSpendingFrequency(selectedTransaction.frequency || ''); 
            setEssentiality(selectedTransaction.essentiality || ''); 
            setCategory(selectedTransaction.category || ''); 
            setSpendingDate(selectedTransaction.date || ''); 
            setSpendingTime(selectedTransaction.time || ''); 
        } else {
            // Clear the form fields if no valid transaction is selected
            setSpending('');
            setSpendingAmount('');
            setSpendingFrequency('');
            setEssentiality('');
            setCategory('');
            setSpendingDate('');
            setSpendingTime('');
        }
    };
    

    const handleDeleteSpending = async () => {
        if (userID && selectedTransactionId) { // Ensure we have a selected transaction
            try {
                const userDocRef = doc(db, 'users', userID, 'spending', selectedTransactionId);
                await deleteDoc(userDocRef); // Use deleteDoc to remove the document
    
                console.log('Transaction deleted successfully');
                alert('Transaction deleted successfully!');
    
                // Optionally, you can remove the transaction from the local state after deletion
                setTransactions(prevTransactions =>
                    prevTransactions.filter(transaction => transaction.id !== selectedTransactionId)
                );
    
                setSelectedTransactionId(''); // Reset the selected transaction
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        } else {
            console.error('User not authenticated or no transaction selected');
        }
    };

    return (
        <div id="info-container">
            <div>
                <Navbar />
            </div>

            <h1>Delete Transactions</h1>

            <div className="info-box">
                <label>Your Transactions:</label>
                <select onChange={handleTransactionSelect} value={selectedTransactionId}>
                        <option value="">-- Select a transaction --</option>
                        {transactions.map(transaction => (
                            <option key={transaction.id} value={transaction.id}>
                                {transaction.spendingSource} - ${transaction.amount}
                            </option>
                        ))}
                    </select>

                <label>Expense Name:</label>
                <input
                    type="text"
                    value={spending}
                    onChange={(e) => setSpending(e.target.value)}
                    required
                    disabled 
                />

                <p className="essential-label">Was this expense essential or non-essential?</p>
                <div className="radio-container">
                    <div className="radio-item">
                        <input
                            type="radio"
                            id="essential"
                            name="purchase"
                            value="Essential"
                            checked={essentiality === 'Essential'}
                            onChange={(e) => setEssentiality(e.target.value)}
                            disabled 
                        />
                        <label htmlFor="essential">Essential</label>
                    </div>
                    <div className="radio-item">
                        <input
                            type="radio"
                            id="non-essential"
                            name="purchase"
                            value="Non-Essential"
                            checked={essentiality === 'Non-Essential'}
                            onChange={(e) => setEssentiality(e.target.value)}
                            disabled 
                        />
                        <label htmlFor="non-essential">Non-Essential</label>
                    </div>
                </div>

                <label>Category:</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    disabled 
                >
                    <option value="">Select a category</option>
                    <option value="groceries">Groceries</option>
                    <option value="transport">Transport</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="investments">Investments</option>
                    <option value="others">Others</option>
                </select>

                <label>Amount($):</label>
                <input
                    type="number"
                    min="0"
                    value={spendingAmount}
                    onChange={(e) => setSpendingAmount(e.target.value)}
                    required
                    disabled 
                />

                <label>Date:</label>
                <input
                    type="date"
                    value={spendingDate}
                    onChange={(e) => setSpendingDate(e.target.value)}
                    required
                    disabled 
                />

                <label>Time:</label>
                <input
                    type="time"
                    value={spendingTime}
                    onChange={(e) => setSpendingTime(e.target.value)}
                    required
                    disabled 
                />

                <label>How often:</label>
                <select
                    value={spendingFrequency}
                    onChange={(e) => setSpendingFrequency(e.target.value)}
                    required
                    disabled 
                    
                >
                    <option value="">Select frequency</option>
                    <option value="one-off">One-Off</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
                
                <button type="button" onClick={handleDeleteSpending}>Delete Transaction</button>
            </div>
        </div>
    );
}

export default DeleteTransactions;
