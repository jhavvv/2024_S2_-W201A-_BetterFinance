import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // Firebase Firestore instance

export const checkTimeDifference = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const lastInputTimestamp = userDoc.data().lastInputTimestamp.toMillis(); // Assuming timestamp is stored as a Firebase Timestamp
            const currentTime = new Date().getTime();

            // Calculate the difference in milliseconds
            const timeDifference = currentTime - lastInputTimestamp;

            // Check if more than 24 hours (in milliseconds)
            const oneDayInMillis = 24 * 60 * 60 * 1000;
            return timeDifference > oneDayInMillis;
        } else {
            console.error("No such user document found");
            return true; // If no document exists, we prompt the modal by default
        }
    } catch (error) {
        console.error("Error checking time difference: ", error);
        return true; // Fail-safe to show modal in case of an error
    }
};
