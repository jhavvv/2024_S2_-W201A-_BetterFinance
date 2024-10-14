/* This page was made for testing purposes and can be modified/deleted if needed */


import Navbar from './Navbar';
import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, getDocs, addDoc, doc } from 'firebase/firestore';
import './Savingscss.css';


function Savings() {
    const [SavingName, setSaving] = useState('');
    const [SavingAmount, setAmount] = useState('');
    const [userName, setUserName] = useState('');
    const [userID, setUserID] = useState('');
    const [savings, setSavings] = useState([]);

   /* useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserName(currentUser.displayName || currentUser.email);
            setUserID(currentUser.uid);
            fetchSavings(currentUser.uid);  // Fetch savings on load
        }
    }, []);*/

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserID(user.uid);
                fetchSavings(user.uid);
            } else {
                setUserID('');
                setSavings([]);
            }
        });
    
        return () => unsubscribe();
    }, []);

    const fetchSavings = async (userID) => {
        try {
            const userDocRef = doc(db, 'users', userID);
            const SavingCollectionRef = collection(userDocRef, 'saving');
            const savingsSnapshot = await getDocs(SavingCollectionRef);
            const savingsList = savingsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSavings(savingsList);
        } catch (error) {
            console.error('Error fetching savings:', error);
        }
    };

    const handleAddSaving = async () => {
        if (userID) {
            try {
                // Validate input fields
                if (!SavingName || !SavingAmount) {
                    alert('All fields are required.');
                    return;
                }

                const amount = parseFloat(SavingAmount);
                if (isNaN(amount) || amount <= 0) {
                    alert('Invalid saving amount');
                    return;
                }

                // Reference to user's saving sub-collection
                const userDocRef = doc(db, 'users', userID);
                const SavingCollectionRef = collection(userDocRef, 'saving');

                // Adding the document with date and time fields
                const newSaving = {
                    SavingSource: SavingName,
                    amount,
                };
                const docRef = await addDoc(SavingCollectionRef, newSaving);

                // Add the new saving to the list
                //setSavings([...savings, { id: docRef.id, ...newSaving }]);
                setSavings(prevSavings => [...prevSavings, { id: docRef.id, ...newSaving }])

                console.log('Saving added successfully');
                alert(`Successfully added '${SavingName}' as a savings goal!`);

                // Clear input fields after submission
                setSaving('');
                setAmount('');
            } catch (error) {
                console.error('Error adding saving:', error.message, error);
                alert('Error adding a saving');
            }
        } else {
            console.error('User not authenticated');
        }
    };

    return (
        <div>
            <Navbar />
            <main>
                <h1>Savings</h1>
            </main>

            {/* Savings container with flex layout */}
            <div className="savings-container">
                <div className="input-container">
                    <div className="info-box">
                        <p>What are you saving towards?</p>
                        <label htmlFor="Saving">Saving Name:</label>
                        <input
                            id="saving"
                            type="text"
                            value={SavingName}
                            onChange={(e) => setSaving(e.target.value)}
                            required
                        />
                        <label>Amount:</label>
                        <input
                            type="number"
                            min="0"
                            value={SavingAmount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                        <button type="button" onClick={handleAddSaving}>Add Saving</button>
                    </div>

                    {/* Savings list container */}
                    <div className="savings-list-container">
                        <h3>Your Savings Goals</h3>
                        <ul className="savings-list">
                            {savings.length > 0 ? (
                                savings.map((saving, index) => (
                                    <li key={index} className="saving-item">
                                        <span>{saving.SavingSource} - ${saving.amount}</span>
                                    </li>
                                ))
                            ) : (
                                <p>No savings goals found.</p>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Box on the right */}
                <div className="right-container">
                    {/* Content for the right side will go here */}
                    <h3>Additional Information</h3>
                    <p>This box will be used for additional content.</p>
                    <div className='facts-cont'>
                    <h2>Tips and Tricks for saving!</h2>
                    <h3 className='fact-title'>Better Budgeting for Financial Peace</h3>
                    <p>Budgeting is all about creating a roadmap for your money, so it works for you rather than against you.
                        By Tracking expenses, and using simple strategies like the 50/30/20 rule, you can gain greater control
                        over your finances. A well planned budegt doesn't just help you save more, it reduces financial stress
                        and sets you up for long-term success.
                    </p>
                    {/* Write Facts*/}
                    <h3 className='fact-title'>Track Every Expense</h3>
                    <p className='fact-blurb'>Use an app or a spreadsheet to log every sinlge purchase. This helps you stay mindful of where your money is going and prevents small expenses from piling up unexpectedly</p>

                    <h3 className='fact-title'>Prioritze Needs Over Wants</h3>
                    <p className='fact-blurb'>When creating your budget, always focus on necessities first - things like rent, groceries, and utilities.
                        Once you've accounted for those, allocate money to savings, and finally, set aside a small portion for non-essential expenses.
                    </p>

                    <h3 className='fact-title'>Follow a Budgeting Rule</h3>
                    <p className='fact-blurb'>Following a simple rule of thumb like the 50/30/20 rule that suggests dividing your income into three categories:
                        50% for needs, 30% for wants, and 20% for savings or paying off debt.
                        It's a straightforward way to maintain financial balance without being overly restrictive.
                    </p>
                </div>
                </div>
            </div>
        </div>
    );
}

export default Savings;
