import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore'; 
import { db, auth } from './firebase';
import Navbar from './Navbar';
import './BudgetGoals.css';

function BudgetGoals() {
    const [budgetGoals, setBudgetGoals] = useState([]); // State for budget goals
    const [newGoal, setNewGoal] = useState({}); // State for the new goal
    const [editing, setEditing] = useState(false); // State to track if you're editing
    const [currentGoalId, setCurrentGoalId] = useState(null); // State to track which goal is being edited
    const [userID, setUserID] = useState('');

    // Fetch the current logged in user
    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserID(currentUser.uid);
        }
    }, []);

    // Fetch the users budget goals
    useEffect(() => {
        if(userID) {
            const userDocRef = doc(db, 'users', userID);
            const budgetGoalsRef = collection(userDocRef, 'budgetGoals');

            // Snapshot listener for users goals
            const unsubscribe = onSnapshot(budgetGoalsRef, (snapshot) => {
                const goals = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setBudgetGoals(goals); // Store goals
            });
            return () => unsubscribe();
        }
    }, [userID]);

    // Create a budget goal
    const addBudgetGoal = async () => {
        if(userID){
            try{
                const userDocRef = doc(db, 'users', userID);
                const budgetGoalsRef = collection(userDocRef, 'budgetGoals');

                await addDoc(budgetGoalsRef, {
                    amount: newGoal.amount,        
                    description: newGoal.description, 
                    timePeriod: newGoal.timePeriod, 
                    createdAt: new Date()           
                });

                console.log("Budget goal successfully added!");

            } catch (error) {
                console.error("Error adding budget goal: ", error);
            }
        } else {
            console.error("No user ID found, cannot add budget goal.");
        }
    };

    // Update budget goal
    const updateBudgetGoal = async (id, updatedGoal) => {
        try {
            // Reference to the specific budget goal document
            const userDocRef = doc(db, 'users', userID);  
            const budgetGoalRef = doc(userDocRef, 'budgetGoals', id); 

            // Update the document with the new values
            await updateDoc(budgetGoalRef, {
                amount: updatedGoal.amount,        
                description: updatedGoal.description, 
                timePeriod: updatedGoal.timePeriod, 
                updatedAt: new Date()                
            });

            // Update local state to reflect the change
            setBudgetGoals(budgetGoals.map(goal => (goal.id === id ? { ...goal, ...updatedGoal } : goal)));

            console.log("Document updated with ID: ", id);
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    // Handle save
    const handleSave = async () => {
        if(editing){
            await updateBudgetGoal(currentGoalId, newGoal);
        }
        else {
            await addBudgetGoal();
        }
    };

    // Handle editing an exisiting goal
    const handleEdit = (goal) => {
        setNewGoal(goal);
        setCurrentGoalId(goal.id);
        setEditing(true);
    }

    return (
        <div className="main-cont">
            <Navbar />
    
            <h1>Manage Your Budget Goals</h1>
    
            <div className="budget-cont">
                <div className="budget-form">
                    <h2>{editing ? 'Update Budget Goal' : 'Add Budget Goal'}</h2>
                    <label>Goal Amount</label>
                    <input 
                        type="number"
                        placeholder="Goal Amount"
                        value={newGoal.amount || ''}
                        onChange={(e) => setNewGoal({ ...newGoal, amount: e.target.value })}
                    />
    
                    <label>Description</label>
                    <input 
                        type="text"
                        placeholder="Goal Description (e.g., Save for vacation)"
                        value={newGoal.description || ''}
                        onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    />
    
                    <label>Time Period</label>
                    <select 
                        value={newGoal.timePeriod || ''}
                        onChange={(e) => setNewGoal({ ...newGoal, timePeriod: e.target.value })}
                    >
                        <option value="" disabled>Select time period</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                    </select>
    
                    <button 
                        onClick={handleSave} 
                        disabled={!newGoal.amount || !newGoal.description || !newGoal.timePeriod}
                    >
                        {editing ? 'Update Goal' : 'Save Goal'}
                    </button>
                </div>
    
                {editing && (
                    <button onClick={() => {
                        setEditing(false);
                        setNewGoal({});
                    }}>
                        Cancel Edit
                    </button>
                )}
            </div>

            <div className="goal-list">
                <h2>Your Current Budget Goals</h2>
                {budgetGoals.length > 0 ? (
                    <ul>
                        {budgetGoals.map((goal) => (
                            <li key={goal.id}>
                                <strong>{goal.description}</strong>: {goal.amount} ({goal.timePeriod})
                                <button onClick={() => handleEdit(goal)}>Edit</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No budget goals to display</p>
                )}
            </div>
        </div>
    );    
}

export default BudgetGoals;