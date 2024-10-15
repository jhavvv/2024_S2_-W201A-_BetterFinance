import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore'; 
import { db, auth } from './firebase';
import Navbar from './Navbar';

function BudgetGoals() {
    const [budgetGoals, setBudgetGoals] = useState([]); // State for budget goals
    const [newGoal, setNewGoal] = useState({}); // State for the new goal
    const [editing, setEditing] = useState(false); // State to track if you're editing
    const [currentGoalId, setCurrentGoalId] = useState(null); // State to track which goal is being edited
    const [userID, setUserID] = useState('');

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserID(currentUser.uid);
        }
    }, []);

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
            const userDocRef = doc(db, 'users', userID);  // Reference to the user's document
            const budgetGoalRef = doc(userDocRef, 'budgetGoals', id); // Reference to the budget goal in user's subcollection

            // Update the document with the new values
            await updateDoc(budgetGoalRef, {
                amount: updatedGoal.amount,        // Update amount
                description: updatedGoal.description, // Update description
                timePeriod: updatedGoal.timePeriod, // Update time period
                updatedAt: new Date()                // Optionally track the update time
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
        if (userID) {
            if (editing) {
                try {
                    // Call update function
                    await updateBudgetGoal(currentGoalId, newGoal);
                    console.log('Goal updated successfully');
                    setEditing(false); // Reset the editing state after update
                } catch (error) {
                    console.error('Error updating goal:', error);
                }
            } else {
                try {
                    // Call add function
                    await addBudgetGoal(newGoal);
                    console.log('Goal added successfully');
                } catch (error) {
                    console.error('Error adding goal:', error);
                }
            }
        } else {
            console.error("User ID not found, cannot save goal.");
        }
    };

    return (
        <div className="main-cont">
            <Navbar />
    
            <h1>{editing ? 'Update Your Budget Goal' : 'Set Up a Budget Goal'}</h1>
    
            <div className="budget-cont">
                <div className="budget-form">
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
                    <div className="cancel-edit">
                        <button onClick={() => setEditing(false)}>Cancel Edit</button>
                    </div>
                )}
            </div>
        </div>
    );    
}

export default BudgetGoals;
