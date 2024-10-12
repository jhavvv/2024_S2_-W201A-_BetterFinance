import React, { useState, useEffect } from 'react';
import './Informationstyling.css';
import './index.js';
import './stylesheet.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, collection, addDoc } from 'firebase/firestore';
import { handleDailyStreak } from './DailyStreak';

function Infopage() {
    const [income, setIncome] = useState('');
    const [incomeAmount, setIncomeAmount] = useState('');
    const [incomeFrequency, setIncomeFrequency] = useState('');

    const [spending, setSpending] = useState('');
    const [spendingAmount, setSpendingAmount] = useState('');
    const [spendingFrequency, setSpendingFrequency] = useState('');
    const [essentiality, setEssentiality] = useState('');
    const [category, setCategory] = useState('');

    const [incomeDate, setIncomeDate] = useState('');
    const [incomeTime, setIncomeTime] = useState('');
    
    const [spendingDate, setSpendingDate] = useState('');
    const [spendingTime, setSpendingTime] = useState('');

    const [userName, setUserName] = useState('');
    const [userID, setUserID] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserName(currentUser.displayName || currentUser.email);
            setUserID(currentUser.uid);
        }
    }, []);

    const handleAddIncome = async () => {
        if (userID) {
            try {
                // Validate input fields
                if (!income || !incomeAmount || !incomeFrequency || !incomeDate || !incomeTime) {
                    console.error('All fields are required.');
                    return;
                }
    
                const amount = parseFloat(incomeAmount);
                if (isNaN(amount) || amount <= 0) {
                    console.error('Invalid income amount');
                    return;
                }
    
                // Reference to user's income sub-collection
                const userDocRef = doc(db, 'users', userID);
                const incomeCollectionRef = collection(userDocRef, 'income');
    
                // Adding the document with date and time fields
                await addDoc(incomeCollectionRef, {
                    incomeSource: income,
                    amount,
                    frequency: incomeFrequency,
                    incomeDate,
                    time: incomeTime,
                    timestamp: new Date() // For server-side timestamp if needed
                });
                await handleDailyStreak(userID, db);
    
                console.log('Income added successfully');
                navigate('/success', { state: { messageType: 'Income' } });
            } catch (error) {
                console.error('Error adding income:', error.message, error);
            }
        } else {
            console.error('User not authenticated');
        }
    };
    

    

    const handleAddSpending = async () => {
        if (userID) {
            try {
                // Check if the input fields are not empty before proceeding
                if (!spending || !spendingAmount || !spendingFrequency || !essentiality || !category || !spendingDate || !spendingTime) {
                    console.error('All fields are required.');
                    return;
                }

                const userDocRef = doc(db, 'users', userID);
                const spendingCollectionRef = collection(userDocRef, 'spending');
                await addDoc(spendingCollectionRef, {
                    spendingSource: spending,
                    amount: parseFloat(spendingAmount),
                    frequency: spendingFrequency,
                    essentiality: essentiality,
                    category: category,
                    date: spendingDate,
                    time: spendingTime,
                    timestamp: new Date()
                });
                await handleDailyStreak(userID, db);
                console.log('Spending added successfully');
                // Navigate to SuccessPage with messageType state
                navigate('/success', { state: { messageType: 'Spending' } });
            } catch (error) {
                console.error('Error adding spending:', error);
            }
        } else {
            console.error('User not authenticated');
        }
    };

    return (
        <div>
            <header>
                <Navbar />
            </header>

            <div id="info-container">
                <h1>Information</h1>

                <div id="boxes-container">
                    {/* Income Section */}
                    <div className="info-box">
                        <p>Income</p>
                        <label htmlFor="income">Add income:</label>
                        <input
                            id="income"
                            type="text"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                            required
                        />
                        <label>Amount:</label>
                        <input
                            type="number"
                            min="0"
                            value={incomeAmount}
                            onChange={(e) => setIncomeAmount(e.target.value)}
                            required
                        />
                        <label>Date:</label>
                        <input
                            type="date"
                            value={incomeDate}
                            onChange={(e) => setIncomeDate(e.target.value)}
                            required
                        />

                        <label>Time:</label>
                        <input
                            type="time"
                            value={incomeTime}
                            onChange={(e) => setIncomeTime(e.target.value)}
                            required
                        />
                        <label>How often:</label>
                        <select
                            value={incomeFrequency}
                            onChange={(e) => setIncomeFrequency(e.target.value)}
                            required
                        >
                            <option value="">Select frequency (N/A if one-off)</option>
                            <option value="one-off">One-Off</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                        <button type="button" onClick={handleAddIncome}>Add Income source</button>
                    </div>

                    {/* Spending Section */}
                    <div className="info-box">
                        <p>Spending</p>
                        <label>Add expense:</label>
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
                            <option value="">Select frequency </option>
                            <option value="one-off">One-Off</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                        <button type="button" onClick={handleAddSpending}>Add Expense</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Infopage;
