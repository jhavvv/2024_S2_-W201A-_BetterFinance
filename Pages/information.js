// <!DOCTYPE html>
// <html lang="en">

// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Information</title>
// </head>


import React from 'react';
import ReactDOM from 'react-dom';
import './pagestyling.css';

function App() {
    return (

        <body>
            <h1>Information</h1>

            <td>1, 2</td>

            <p>Spending
                <button>Add expense</button>

            </p>

            <p>Income


                <button>Add Income source</button>
            </p>

            <p>Regular Payees


                <button>Add Payee</button>
            </p>
        </body>
    );
}
ReactDOM.render(<App />, document.getElementById('root'));