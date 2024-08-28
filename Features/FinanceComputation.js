import React from 'react';

function Algorithm({ income, spendings }) {
    const sum = income - spendings;

    return (
        <div>
            <h2>Income and Spendings</h2>
            <p>Income: ${income}</p>
            <p>Spendings: ${spendings}</p>
            <p>Remaining: ${sum}</p>
        </div>
    );
}

export default Algorithm;