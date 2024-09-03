import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage.js';
import RegisterPage from './RegisterPage.js';
import HelpPage from './help.js';
import IndexPage from './index.js';
import InformationPage from './information.js';

function App() {
  return (
    <Router>
       <div className = "App">
        <Routes>
          <Route path="/" element={<HelpPage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;