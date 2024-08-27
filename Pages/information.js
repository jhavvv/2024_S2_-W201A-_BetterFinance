// <!DOCTYPE html>
// <html lang="en">

// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Information</title>
// </head>


import React from 'react';
import ReactDOM from 'react-dom';
import './Informationstyling.css';
import './index.js'

function App() {
    App(); 
    
    return (
        
           



            <div id="info-container">
                <h1>Information</h1>

                <div id="boxes-container">
                    <div className="info-box">
                        <p>Income</p>
                        <button>Add Income source</button>
                    </div>

                    <div className="info-box">
                        <p>Spending</p>
                        <button>Add expense</button>
                    </div>

                    <div className="info-box">
                        <p>Regular Payees</p>
                        <button>Add Payee</button>
                    </div>
                </div>
            </div>


        
    );
}
// ReactDOM.render(<App />, document.getElementById('root'));
export default App;