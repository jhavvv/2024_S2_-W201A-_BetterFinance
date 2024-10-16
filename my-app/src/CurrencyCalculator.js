import React, { useState } from 'react';
import Navbar from './Navbar';
import './CurrencyCalculator.css'

/*
Exchange rates are hard-coded in. I looked into an API to get 
the current exchange rates, but it conflicted with the API used 
for the emails and caused the website to break. There was also a
limited amount of API requests while using the free plan for it,
so I decided not to use it.
-Ijaz
*/

const exchangeRates = {
  NZD: 1,
  AUD: 0.91,
  USD: 0.61,
  EUR: 0.56,
  JPY: 91.29,
};

const CurrencyCalculator = () => {
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState('NZD');
  const [toCurrency, setToCurrency] = useState('AUD');
  const [convertedAmount, setConvertedAmount] = useState(0);

  const handleConvert = () => {
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    const result = (amount / fromRate) * toRate;
    setConvertedAmount(result.toFixed(2));
  };

  return (
    <div className="calculator-container">
        <div>
        <header>
            <Navbar />
        </header>
        </div>
      <div className="CurrencyCalculator">
      
        <h1>Currency Calculator</h1>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {Object.keys(exchangeRates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <span style={{ color: 'white' }}> to </span>
        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {Object.keys(exchangeRates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <button onClick={handleConvert}>Convert</button>
        <h2>
          Converted Amount: {convertedAmount} {toCurrency}
        </h2>
      </div>
    </div>
  );
};

export default CurrencyCalculator;
