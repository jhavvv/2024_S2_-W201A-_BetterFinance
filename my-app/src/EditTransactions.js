import React, { useState, useEffect } from 'react';
import './Informationstyling.css';
import './index.js';
import './stylesheet.css';
import Navbar from './Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function EditTransactions() {
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
            fetchTransactionData(currentUser.uid, transactionId);
        }
    }, [transactionId]);

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

    const handleUpdateSpending = async () => {
        if (userID) {
            try {
                const userDocRef = doc(db, 'users', userID, 'spending', transactionId);
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
            console.error('User not authenticated');
        }
    };

    return (
        <div id="info-container">
            <h1>Edit Transaction</h1>

            <header>
                <Navbar />
            </header>
        
            <div className="info-box">
                <p>Spending</p>
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
