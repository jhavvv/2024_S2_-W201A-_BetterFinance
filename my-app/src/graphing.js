import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { auth, db } from './firebase'; // Ensure firebase is imported
import { collection, getDocs } from 'firebase/firestore';
import { query, where} from 'firebase/firestore';
import { LineChart } from '@mui/x-charts/LineChart'; // Assuming you're using 'recharts' for graphing

export function LineChartGraphing() {
    const [incomeData, setIncomeData] = useState([]);
    const [xAxisData, setXAxisData] = useState([]);
    const [userID, setUserID] = useState(null); // Add userID to local state

    useEffect(() => {
        const currentUser = auth.currentUser; // Get the authenticated user
        if (currentUser) {
            setUserID(currentUser.uid); // Set the userID once authenticated
        }
    }, []);

    useEffect(() => {
        const fetchIncomeData = async () => {
            if (userID) { // Only fetch data if userID exists
                try {
                    const userDocRef = collection(db, 'users', userID, 'income'); // Use userID safely
                    const querySnapshot = await getDocs(userDocRef);
        
                    const incomeList = [];
                    const dates = [];
        
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const incomeDate = data.incomeDate; // incomeDate is stored as yyyy-mm-dd
                        
                        // Check if incomeDate is defined
                        if (incomeDate) {
                            const [year, month, day] = incomeDate.split('-').map(Number); // Split and parse the date
                            const currentMonth = new Date().getMonth() + 1; // Get the current month
        
                            if (month === currentMonth) {
                                incomeList.push(data.amount); // Store income amount
                                dates.push(day); // Store day of the month
                            }
                        } else {
                            console.warn(`incomeDate is undefined for document ID: ${doc.id}`); // Log a warning
                        }
                    });
        
                    setIncomeData(incomeList);
                    setXAxisData(dates);
                } catch (error) {
                    console.error('Error fetching income data:', error);
                }
            }
        };
        

        fetchIncomeData();
    }, [userID]); // Trigger fetch when userID is available

    return (
        <LineChart
            xAxis={[{ data: xAxisData }]} // X-axis is the day of the month

            series={[
                {
                    data: incomeData, // Y-axis is the income amount
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
