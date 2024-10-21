import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from './firebase'; // Make sure to import your Firestore instance

// Function to update lastInputTimestamp
export const updateLastInputTimestamp = async (userID) => {
    try {
        const userRef = doc(db, 'users', userID);

        // Save the current timestamp
        await setDoc(userRef, {
            lastInputTimestamp: new Date() // Use Firebase.firestore.Timestamp.now() for server time
        }, { merge: true }); // Use merge to avoid overwriting existing fields

        console.log('Last input timestamp updated successfully');
    } catch (error) {
        console.error('Error updating last input timestamp:', error);
    }
};
