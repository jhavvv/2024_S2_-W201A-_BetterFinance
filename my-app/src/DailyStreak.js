//import React from React;
import { updateDoc, getDoc, doc } from "firebase/firestore";

// Function to handle the daily streak
export const handleDailyStreak = async (userID, db) => {
    if (userID) {
        const userDocRef = doc(db, 'users', userID);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const lastUpdated = userData.lastUpdated ? userData.lastUpdated.toDate() : null;
            const streakCount = userData.streakCount || 0;
            const currentTime = new Date();

            // Check if 24 hours have passed since the last streak update
            if (!lastUpdated || (currentTime - lastUpdated) > 24 * 60 * 60 * 1000) {
                await updateDoc(userDocRef, {
                    streakCount: streakCount + 1,
                    lastUpdated: new Date()
                });
                console.log("Daily streak updated!");
            } else {
                console.log("Streak can only be updated once every 24 hours.");
            }
        } else {
            await updateDoc(userDocRef, {
                streakCount: 1,
                lastUpdated: new Date()
            });
            console.log("Initial streak started!");
        }
    } else {
        console.error('User not authenticated');
    }
};

