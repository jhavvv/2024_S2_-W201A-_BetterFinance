/* This page was made for testing purposes and can be modified/deleted if needed */

import React from 'react';
import Navbar from './Navbar';

function TransactionHistory({ showOnlyList = false }) {
    // Correct list definition
    const list = [
        { id: 1, item: 'Bread' },
        { id: 2, item: 'Car' },
        { id: 3, item: 'Dog' }
    ];

    return (
        <div>
            {!showOnlyList && <Navbar />}  {/* Only render Navbar if showOnlyList is false */}
            <main>
                {!showOnlyList && <h1>Transaction History</h1>}  {/* Only show the heading if showOnlyList is false */}
                <ul>
                    {list.map((transaction) => (
                        <li key={transaction.id}>
                            {transaction.id}: {transaction.item}
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}

export default TransactionHistory;
