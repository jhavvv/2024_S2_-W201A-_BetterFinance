import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import WelcomePage from './WelcomePage';
import Infopage from './information';
import EditProfile from './EditProfile';
import MonthlyRecap from './MonthlyRecap';
import TransactionHistory from './TransactionHistory';
import MonthlyIncome from './MonthlyIncome';
import Savings from './Savings';
import Help from './help';
import AboutUs from './AboutUs';
import SuccessPage from './SuccessPage';
import EditTransactions from './EditTransactions';
import DeleteTransactions from './DeleteTransactions';
import BudgetGoals from './BudgetGoal';
import Articles from './Articles';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Default route */}
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/RegisterPage" element={<RegisterPage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/monthly-recap" element={<MonthlyRecap />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/monthly-income" element={<MonthlyIncome />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/BudgetGoal" element={<BudgetGoals />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/Infopage" element={<Infopage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/edit-transactions" element={<EditTransactions />} />
          <Route path="/delete-transactions" element={<DeleteTransactions />} />
          <Route path="/articles" element={<Articles />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;