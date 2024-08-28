import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheet.css';

function App() {
    return (
        <div>
            <header>
                <div id="navbar">
                    {/* Transaction Page */}
                    <a href="transactions.html" title="Transactions">Transactions</a>

                    {/* Information Page */}
                    <a href="information.html" title="Information">Information</a>

                    {/* Graphs Page */}
                    <a href="graphs.html" title="Graphs">Graphs</a>

                    {/* Help Page */}
                    <a href="help.html" title="Help">Help</a>
                </div>
            </header>

            <main>
                <h1>Welcome</h1>

                {/* Transaction Page */}
                <a href="transactions.html" target="_blank" rel="noopener noreferrer">Transactions</a>

                {/* Information Page */}
                <a href="information.html" target="_blank" rel="noopener noreferrer">Information</a>

                {/* Graphs Page */}
                <a href="graphs.html" target="_blank" rel="noopener noreferrer">Graphs</a>

                {/* Help Page */}
                <a href="help.html" target="_blank" rel="noopener noreferrer">Help</a>
            </main>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
