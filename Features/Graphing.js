
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';

export default function LineChartGraphing(calculator) {
    return (
        <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]} //change to use income and spendings... would use calculator from financecompute to make graph
            series={[
                {
                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
            ]}
            width={500}
            height={300}
        //would return a showing over either saving over time or comparison to spending vs incomes
        />
    );
}
export default function PieChartEssentials() {
    return (
        <PieChart
            colors={['red', 'blue']}
            series={[
                {
                    data: [
                        {id: 0, value: 10, color: 'blue', label: 'Essential'},
                        {id: 1, value: 15, color: 'red', label: 'Non-essential'}, 
                    ],
                },
            ]}
            width={400}
            height={200}
            //this pie chart would display percentage from essential spendings
        />
    );
}
export default function PieChartCategories() {
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
                        { id: 4, value: 30, color: 'pink', label: 'something' },
                        { id: 5, value: 35, color: 'yellow', label: 'somethingelse' },
                    ],
                },
            ]}
            width={400}
            height={200}
            //this pie chart would display percentage from categories of spendings
        />
    );
}