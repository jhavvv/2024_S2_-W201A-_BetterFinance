import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { auth, db } from './firebase'; // Ensure firebase is imported
import { collection, getDocs } from 'firebase/firestore';
import { query, where} from 'firebase/firestore';
import { BarChart } from '@mui/x-charts/BarChart'; 
import BasicDateRangeCalendar from './BasicDateRangeCalendar.js';
import { query, where } from 'firebase/firestore';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';

export function BarChartGraphing({ dateRange }) {
    const [incomeData, setIncomeData] = useState(Array(31).fill(0)); // Initialize with 0 for all days
    const [userID, setUserID] = useState(null); // Add userID to local state

    useEffect(() => {
        const currentUser = auth.currentUser; // Get the authenticated user
        if (currentUser) {
            setUserID(currentUser.uid); // Set the userID once authenticated
        }
    }, []);

    useEffect(() => {
        const fetchIncomeData = async () => {
            if (userID && dateRange[0] && dateRange[1]) { // Only fetch data if userID exists and date range set
                try {
                    const userDocRef = collection(db, 'users', userID, 'income'); // Use userID safely
                    const incomeQuery = query(
                        userDocRef,
                        where('incomeDate', '>=', dateRange[0]),
                        where('incomeDate', '<=', dateRange[1])
                    );
                    const querySnapshot = await getDocs(incomeQuery);
                    const incomeList = Array(31).fill(0); // Initialize for 31 days

                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const incomeDate = data.incomeDate; // incomeDate is stored as yyyy-mm-dd
                        const incomeAmount = data.amount || 0; // Get income amount, default 0 if undefined
                        
                        if (incomeDate) {
                            const [year, month, day] = incomeDate.split('-').map(Number); // Split and parse the date
                            const currentMonth = new Date().getMonth() + 1; // Get the current month

                            if (month === currentMonth) {
                                incomeList[day - 1] += incomeAmount; // Accumulate income for the day
                            }
                        } else {
                            console.warn(`incomeDate is undefined for document ID: ${doc.id}`); // Log a warning
                        }
                    });

                    setIncomeData(incomeList); // Update the state with the accumulated income data
                } catch (error) {
                    console.error('Error fetching income data:', error);
                }
            }
        };

        fetchIncomeData();
    }, [userID, dateRange]); // Trigger fetch when userID is available

    // Generate an array from 1 to 31 for the x-axis (days of the month)
    const xAxisData = Array.from({ length: 31 }, (_, index) => index + 1);

    return (
        <BarChart
            xAxis={[{ data: xAxisData, scaleType: 'band' }]} // X-axis shows days 1-31
            series={[{
                data: incomeData, // Y-axis shows accumulated income data, with missing days set to 0
            }]}
            width={500}
            height={190}
        />
    );
}


// Pie Chart for Essential and Non-Essential Spending
export function PieChartEssentials({ dateRange }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Fetch spending data from Firestore
        const fetchSpendingData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser && dateRange[0] && dateRange[1]) {
                try {
                    const userID = currentUser.uid;
                    const userDocRef = collection(db, 'users', userID, 'spending');
                    // Add a Firestore query to filter by the selected date range
                    const spendingQuery = query(
                        userDocRef,
                        where('date', '>=', dateRange[0]),
                        where('date', '<=', dateRange[1])
                    );
                    const spendingSnapshot = await getDocs(spendingQuery);

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
    }, [dateRange]);

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

export function PieChartCategories() {
    const [categoryData, setCategoryData] = useState(null);

    useEffect(() => {
        // Fetch spending data from Firestore and categorize it
        const fetchSpendingData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                try {
                    const userID = currentUser.uid;
                    const userDocRef = collection(db, 'users', userID, 'spending');
                    const spendingSnapshot = await getDocs(userDocRef);

                    // Initialize categories with 0 values
                    let categoryMap = {
                        groceries: 0,
                        transport: 0,
                        entertainment: 0,
                        investments: 0,
                        other: 0,
                    };

                    // Process each spending document
                    spendingSnapshot.forEach((doc) => {
                        const spendingData = doc.data();
                        const category = spendingData.category || 'other'; // Default to 'Other' if no category

                        // Accumulate spending amount for each category
                        if (categoryMap[category] !== undefined) {
                            categoryMap[category] += spendingData.amount;
                        } else {
                            categoryMap['other'] += spendingData.amount; // Add to 'Other' if category is unrecognized
                        }
                    });

                    // Prepare data for PieChart
                    const pieChartData = Object.keys(categoryMap).map((category, index) => ({
                        id: index,
                        value: categoryMap[category],
                        label: category,
                        color: getCategoryColor(category), // Function to assign colors to categories
                    }));

                    setCategoryData(pieChartData);

                } catch (error) {
                    console.error('Error fetching spending data:', error);
                }
            }
        };

        fetchSpendingData();
    }, []);

    // Function to assign colors to categories
    const getCategoryColor = (category) => {
        const colors = {
            groceries: 'green',
            transport: 'purple',
            entertainment: 'orange',
            investments: 'red',
            other: 'pink',
        };
        return colors[category]
    };

    return (
        <>
            {categoryData ? (
                <PieChart
                    series={[{ data: categoryData }]}
                    width={300}
                    height={175}
                />
            ) : (
                <p>Loading...</p> // A loading message while data is being fetched
            )}
        </>
    );
}


