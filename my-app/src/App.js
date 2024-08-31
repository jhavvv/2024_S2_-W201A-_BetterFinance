import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage.js';
import RegisterPage from './RegisterPage.js';
import WelcomePage from './WelcomePage.js';
import EditProfile from './EditProfile';
import MonthlyRecap from './MonthlyRecap';
import TransactionHistory from './TransactionHistory';
import MonthlyIncome from './MonthlyIncome';
import Savings from './Savings';
import Services from './Services';
import AboutUs from './AboutUs';

function App() {
  return (
    <Router>
       <div className = "App">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome-page" element={<WelcomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/monthly-recap" element={<MonthlyRecap />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/monthly-income" element={<MonthlyIncome />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;