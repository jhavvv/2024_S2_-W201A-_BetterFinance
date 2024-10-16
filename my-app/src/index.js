import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import reportWebVitals from './reportWebVitals';
import { BackgroundColorProvider } from './BackgroundColorContext';

// Create the root element and wrap the App with BackgroundColorProvider and BrowserRouter
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BackgroundColorProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BackgroundColorProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
