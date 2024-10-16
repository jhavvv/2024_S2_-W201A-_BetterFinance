import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HamburgerMenu.css'; // Import your CSS for styling
import NavButtons from './NavButtons'; // Make sure this component is correctly imported

function HamburgerMenu({ setBackgroundColor }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage the menu visibility
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        const nav = document.querySelector('.hamburger-nav');
        if (nav) {
            nav.classList.toggle('show', !isMenuOpen); // Toggle 'show' class based on the opposite of isMenuOpen
        }
    };

    return (
        <>
            {/* Hamburger icon to toggle menu */}
            <div className="hamburger-menu" onClick={toggleMenu}>
                <div className="hamburger-icon">&#9776;</div>
            </div>

            {/* Conditional rendering of the hamburger menu */}
            {isMenuOpen && (
                <aside className="hamburger-nav">
                    {/* Navigation Buttons */}
                    <NavButtons cssName='navigation-btn' navigate={() => navigate('/edit-profile')} text='Edit Profile' />
                    <NavButtons cssName='navigation-btn' navigate={() => navigate('/monthly-recap')} text='Monthly Recap' />
                    <NavButtons cssName='navigation-btn' navigate={() => navigate('/transaction-history')} text='Transaction History' />
                    <NavButtons cssName='navigation-btn' navigate={() => navigate('/monthly-income')} text='Monthly Income' />
                    <NavButtons cssName='navigation-btn' navigate={() => navigate('/savings')} text='Savings' />
                    <NavButtons cssName='navigation-btn' navigate={() => navigate('/BudgetGoal')} text='Set up a budget goal' />
                    <NavButtons cssName='navigation-btn' navigate={() => navigate('/Infopage')} text='Update Information' />
                    <NavButtons cssName='navigation-btn' navigate={() => navigate('/edit-transactions')} text='Edit Transactions' />
                    <NavButtons cssName='navigation-btn' navigate={() => navigate('/delete-transactions')} text='Delete Transactions' />
                    {/* Color Circles for background selection */}
                    <div className="color-circles">
                        <div className="circle original" onClick={() => setBackgroundColor('#907AD6')}></div>
                        <div className="circle white" onClick={() => setBackgroundColor('white')}></div>
                        <div className="circle black" onClick={() => setBackgroundColor('black')}></div>
                    </div>
                </aside>
            )}
        </>
    );
}

export default HamburgerMenu;
