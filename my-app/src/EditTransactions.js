import React, { useState, useEffect } from 'react';
import './EditTransaction.css';
import './index.js';
import './stylesheet.css';
import Navbar from './Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc, getDocs, collection, updateDoc } from 'firebase/firestore';

function EditTransactions() {
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
            setSpending(selectedTransaction.spendingSource);
            setSpendingAmount(selectedTransaction.amount);
            setSpendingFrequency(selectedTransaction.frequency);
            setEssentiality(selectedTransaction.essentiality);
            setCategory(selectedTransaction.category);
            setSpendingDate(selectedTransaction.date);
            setSpendingTime(selectedTransaction.time);
        } else {
            // Clear fields if no selection is made
            setSpending('');
            setSpendingAmount('');
            setSpendingFrequency('');
            setEssentiality('');
            setCategory('');
            setSpendingDate('');
            setSpendingTime('');
        }
    };

    const handleUpdateSpending = async () => {
        if (userID && selectedTransactionId) { // Ensure we have a selected transaction
            try {
                const userDocRef = doc(db, 'users', userID, 'spending', selectedTransactionId);
                await updateDoc(userDocRef, {
                    spendingSource: spending,
                    amount: parseFloat(spendingAmount),
                    frequency: spendingFrequency,
                    essentiality: essentiality,
                    category: category,
                    date: spendingDate,
                    time: spendingTime,
                    timestamp: new Date()
                });

                console.log('Spending updated successfully');
                navigate('/success', { state: { messageType: 'Update' } });
            } catch (error) {
                console.error('Error updating spending:', error);
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

            <h1>Edit Transactions</h1>
            
            <div className="transaction-dropdown">
                <select onChange={handleTransactionSelect} value={selectedTransactionId}>
                    <option value="">-- Select a transaction --</option>
                    {transactions.map(transaction => (
                        <option key={transaction.id} value={transaction.id}>
                            {transaction.spendingSource} - ${transaction.amount}
                        </option>
                    ))}
                </select>
            </div>

            <div className="info-box">
                <label>Edit expense:</label>
                <input
                    type="text"
                    value={spending}
                    onChange={(e) => setSpending(e.target.value)}
                    required
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
                        />
                        <label htmlFor="non-essential">Non-Essential</label>
                    </div>
                </div>

                <label>Category:</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
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
                />

                <label>Date:</label>
                <input
                    type="date"
                    value={spendingDate}
                    onChange={(e) => setSpendingDate(e.target.value)}
                    required
                />

                <label>Time:</label>
                <input
                    type="time"
                    value={spendingTime}
                    onChange={(e) => setSpendingTime(e.target.value)}
                    required
                />

                <label>How often:</label>
                <select
                    value={spendingFrequency}
                    onChange={(e) => setSpendingFrequency(e.target.value)}
                    required
                >
                    <option value="">Select frequency</option>
                    <option value="one-off">One-Off</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
                
                <button type="button" onClick={handleUpdateSpending}>Save Changes</button>
            </div>
        </div>
    );
}

export default EditTransactions;
