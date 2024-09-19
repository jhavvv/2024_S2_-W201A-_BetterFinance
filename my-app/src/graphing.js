import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { auth, db } from './firebase'; // Ensure firebase is imported
import { collection, getDocs } from 'firebase/firestore';

// Line Chart for Income (unchanged)
export function LineChartGraphing() {
    return (
        <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]} // Example data
            series={[
                {
                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
            ]}
            width={500}
            height={190}
        />
    );
}

// Pie Chart for Essential and Non-Essential Spending
export function PieChartEssentials() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Fetch spending data from Firestore
        const fetchSpendingData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                try {
                    const userID = currentUser.uid;
                    const userDocRef = collection(db, 'users', userID, 'spending');
                    const spendingSnapshot = await getDocs(userDocRef);

                    let essentialCount = 0;
                    let nonEssentialCount = 0;

                    // Process each spending document
                    spendingSnapshot.forEach((doc) => {
                        const spendingData = doc.data();
                        if (spendingData.essentiality === 'Essential') {
                            essentialCount += spendingData.amount;
                        } else if (spendingData.essentiality === 'Non-Essential') {
                            nonEssentialCount += spendingData.amount;
                        }
                    });

                    // Set the data for PieChart
                    setData([
                        { id: 0, value: essentialCount, label: 'Essential', color: 'blue' },
                        { id: 1, value: nonEssentialCount, label: 'Non-Essential', color: 'red' }
                    ]);

                } catch (error) {
                    console.error('Error fetching spending data:', error);
                }
            }
        };

        fetchSpendingData();
    }, []);

    return (
        <>
            {data ? (
                <PieChart
                    colors={['blue', 'red']}
                    series={[
                        {
                            data: data,
                        },
                    ]}
                    width={300}
                    height={175}
                />
            ) : (
                <p>Loading...</p> // A loading message while data is being fetched
            )}
        </>
    );
}

// Pie Chart for Spending Categories (unchanged)
export function PieChartCategories() {
    return (
        <PieChart
            colors={['green', 'purple', 'orange', 'red', 'pink', 'yellow']}
            series={[
                {
                    data: [
                        { id: 0, value: 10, color: 'red', label: 'Groceries' },
                        { id: 1, value: 15, color: 'green', label: 'Transport' },
                        { id: 2, value: 20, color: 'purple', label: 'Entertainment' },
                        { id: 3, value: 25, color: 'orange', label: 'Investments' },
                        { id: 4, value: 30, color: 'pink', label: 'Other' },
                        { id: 5, value: 35, color: 'yellow', label: 'Miscellaneous' },
                    ],
                },
            ]}
            width={300}
            height={175}
        />
    );
}
