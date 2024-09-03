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
    const [income, setIncome] = useState('');
    const [spending, setSpending] = useState('');
    const [payee, setPayee] = useState('');
    return (
        
           



            <div id="info-container">
                <h1>Information</h1>

                <div id="boxes-container">
                    <div className="info-box">
                        <p>Income</p>
                        <label>Add income:</label>
                        <input
                        type="Income"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        required />
                        
                        <button type="submit">Add Income source</button>
                    </div>

                    
                    
                    <div className="info-box">
                        <p>Spending</p>
                        <label>Add expense:</label>
                        <input
                        type="spending"
                        value={spending}
                        onChange={(e) => setSpending(e.target.value)}
                        required />
                        <button type="submit">Add expense</button>
                    </div>

                    
                    
                    <div className="info-box">
                        <p>Regular Payees</p>
                        <label>Add Payee:</label>
                        <input
                        type="Payee"
                        value={payee}
                        onChange={(e) => setPayee(e.target.value)}
                        required />
                        <button type="submit">Add Payee</button>
                    </div>
                </div>
            </div>


        
    );
}
// ReactDOM.render(<App />, document.getElementById('root'));
export default App;