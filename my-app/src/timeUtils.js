import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the path to your firebase configuration if needed

// Function to check the time difference since last input
export const checkTimeDifference = async (userID) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userID));
        if (userDoc.exists()) {
            const lastInputTimestamp = userDoc.data().lastInputTimestamp?.toDate();
            const currentTime = new Date();

            // Calculate the time difference in hours
            const timeDifference = Math.abs(currentTime - lastInputTimestamp) / 36e5;

            if (timeDifference > 24) {
                return true; // Return true if it’s been more than 24 hours
            }
        }
    } catch (error) {
        console.error('Error checking time difference:', error);
    }
    return false; // Return false if the check fails or less than 24 hours have passed
};
