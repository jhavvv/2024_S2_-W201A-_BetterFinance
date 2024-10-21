import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, collection, setDoc, getDoc, addDoc, getDocs } from 'firebase/firestore';
import Modal from './Modal';

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
    const [budget, setBudget] = useState('');

    const [showModal, setShowModal] = useState(false); // For modal visibility
    const [lastInputTimestamp, setLastInputTimestamp] = useState(null); // Store last input time

    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserName(currentUser.displayName || currentUser.email);
            setUserID(currentUser.uid);
        }
        if (userID) {
            fetchBudget();
            checkLastInputTime();
        }
    }, [userID]);

    const checkLastInputTime = async () => {
        if (userID) {
            const userDocRef = doc(db, 'users', userID);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                const lastTimestamp = userData.lastInputTimestamp?.toDate(); // Convert Firestore timestamp

                if (lastTimestamp) {
                    setLastInputTimestamp(lastTimestamp);
                    const now = new Date();
                    const timeDifference = now - lastTimestamp;
                    const hoursDifference = timeDifference / (1000 * 60 * 60);

                    if (hoursDifference > 24) {
                        setShowModal(true); // Show the modal if more than 24 hours have passed
                    }
                }
            }
        }
    };

    const fetchBudget = async () => {
        if (userID) {
            try {
                const userDocRef = doc(db, 'users', userID);
                const budgetCollectionRef = collection(userDocRef, 'budget');
                const budgetSnapshot = await getDocs(budgetCollectionRef);

                if (!budgetSnapshot.empty) {
                    const budgetData = budgetSnapshot.docs[0].data();
                    setBudget(budgetData.monthlyBudget);
                } else {
                    // No budget set yet, display placeholder
                    setBudget('');
                }
            } catch (error) {
                console.error('Error fetching budget:', error.message);
            }
        }
    };

    const updateLastInputTimestamp = async (userID) => {
        try {
            const userRef = doc(db, 'users', userID);
            await setDoc(userRef, {
                lastInputTimestamp: new Date() // Use Firebase.firestore.Timestamp.now() for server time
            }, { merge: true });
            console.log('Last input timestamp updated successfully');
        } catch (error) {
            console.error('Error updating last input timestamp:', error);
        }
    };

    const handleAddIncome = async () => {
        if (userID) {
            try {
                // Input validation...
                const userDocRef = doc(db, 'users', userID);
                const incomeCollectionRef = collection(userDocRef, 'income');
                await addDoc(incomeCollectionRef, {
                    incomeSource: income,
                    amount: parseFloat(incomeAmount),
                    frequency: incomeFrequency,
                    incomeDate,
                    time: incomeTime,
                    timestamp: new Date()
                });

                // Update last input timestamp in the user's document
                await updateLastInputTimestamp(userID);

                console.log('Income added successfully');
                navigate('/success', { state: { messageType: 'Income' } });
            } catch (error) {
                console.error('Error adding income:', error.message);
            }
        } else {
            console.error('User not authenticated');
        }
    };

    const handleAddSpending = async () => {
        if (userID) {
            try {
                // Input validation...
                const userDocRef = doc(db, 'users', userID);
                const spendingCollectionRef = collection(userDocRef, 'spending');
                await addDoc(spendingCollectionRef, {
                    spendingSource: spending,
                    amount: parseFloat(spendingAmount),
                    frequency: spendingFrequency,
                    essentiality,
                    category,
                    date: spendingDate,
                    time: spendingTime,
                    timestamp: new Date()
                });

                // Update last input timestamp in the user's document
                await updateLastInputTimestamp(userID);

                console.log('Spending added successfully');
                navigate('/success', { state: { messageType: 'Spending' } });
            } catch (error) {
                console.error('Error adding spending:', error);
            }
        } else {
            console.error('User not authenticated');
        }
    };

    const handleSaveBudget = async () => {
        if (userID) {
            try {
                if (!budget || isNaN(parseFloat(budget)) || parseFloat(budget) <= 0) {
                    console.error('Please enter a valid budget');
                    return;
                }

                const userDocRef = doc(db, 'users', userID, 'budget', 'monthlyBudget');
                await setDoc(userDocRef, {
                    monthlyBudget: parseFloat(budget),
                    timestamp: new Date()
                });

                console.log('Budget saved successfully');
                navigate('/success', { state: { messageType: 'Budget' } });
            } catch (error) {
                console.error('Error saving budget:', error.message);
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
                {/* Modal to remind the user */}
                {showModal && (
                    <Modal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        title="Reminder"
                        message="You have not added or updated your transactions in the last 24 hours."
                    />
                )}

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

                    {/* New Budget Section */}
                    <div className="info-box">
                        <p>Monthly Budget</p>
                        <label htmlFor="budget">Enter your budget for the month:</label>
                        <input
                            id="budget"
                            type="number"
                            min="0"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder={budget === '' ? "No Budget Set Yet - Enter It Here" : budget}
                            required
                        />
                        <button type="button" onClick={handleSaveBudget}>Save Budget</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Infopage;
