// App.js
import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { BackgroundColorProvider } from './BackgroundColorContext';
import Navbar from './Navbar';
import HamburgerMenu from './HamburgerMenu';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import WelcomePage from './WelcomePage';
import EditProfile from './EditProfile';
import TransactionHistory from './TransactionHistory';
import MonthlyIncome from './MonthlyIncome';
import Savings from './Savings';
import Help from './help';
import AboutUs from './AboutUs';
import Infopage from './information';
import SuccessPage from './SuccessPage';
import EditTransactions from './EditTransactions';
import DeleteTransactions from './DeleteTransactions';
import Layout from './Layout';
import BudgetGoals from './BudgetGoal';
import Articles from './Articles';

function App() {
  const [backgroundColor, setBackgroundColor] = useState('#907AD6');
  const location = useLocation();

  // Define the routes where the Navbar and HamburgerMenu should be hidden
  const hideNavbarRoutes = ['/LandingPage', '/LoginPage', '/RegisterPage', '/success', '/'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <BackgroundColorProvider value={{ backgroundColor, setBackgroundColor }}>
      <div style={{ backgroundColor }}>
        {shouldShowNavbar && <Navbar setBackgroundColor={setBackgroundColor} />}
        {shouldShowNavbar && <HamburgerMenu setBackgroundColor={setBackgroundColor} />} {/* Pass setBackgroundColor here */}

        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/RegisterPage" element={<RegisterPage />} />
            <Route path="/welcome" element={<WelcomePage />} /> {/* Avoid duplicate routes */}
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/transaction-history" element={<TransactionHistory />} />
            <Route path="/monthly-income" element={<MonthlyIncome />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/Infopage" element={<Infopage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/edit-transactions" element={<EditTransactions />} />
            <Route path="/delete-transactions" element={<DeleteTransactions />} />
            <Route path="/articles" element={<Articles />} />
          </Routes>
        </div>
      </div>
    </BackgroundColorProvider>
  );
}

export default App;
