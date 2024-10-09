/* Written by Marcos.F */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './LandingPage.css';
import landingBackground from './assets/LandingBackground.jpg';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div>
            <main>
                <div className='title-cont' style={{ backgroundImage: `url(${landingBackground})` }}>

                    <h1>BetterFinance</h1>
                    <h2>Future Ready Finance</h2>

                    <div className='title-button-cont'>
                        <button className='title-button' onClick={() => navigate("/LoginPage")}>Login</button>
                        <button className='title-button' onClick={() => navigate("/RegisterPage")}>Sign Up Today!</button>
                    </div>
                </div>

                <div className='benefits-cont'>
                    <center>
                        <td>
                            <h2>BetterFinance Benefits</h2></td></center>
                    {/* Write about our product*/}
                    <p></p>
                </div>

                <div className='facts-cont'>
                    <h2>Tips and Tricks</h2>
                    <h3 className='fact-title'>Better Budgeting for Financial Peace</h3>
                    <p>Budgeting is all about creating a roadmap for your money, so it works for you rather than against you.
                        By Tracking expenses, and using simple strategies like the 50/30/20 rule, you can gain greater control
                        over your finances. A well planned budegt doesn't just help you save more, it reduces financial stress
                        and sets you up for long-term success.
                    </p>
                    {/* Write Facts*/}
                    <h3 className='fact-title'>Track Every Expense</h3>
                    <p className='fact-blurb'>Use an app or a spreadsheet to log every sinlge purchase. This helps you stay mindful of where your money is going and prevents small expenses from piling up unexpectedly</p>

                    <h3 className='fact-title'>Prioritze Needs Over Wants</h3>
                    <p className='fact-blurb'>When creating your budget, always focus on necessities first - things like rent, groceries, and utilities.
                        Once you've accounted for those, allocate money to savings, and finally, set aside a small portion for non-essential expenses.
                    </p>

                    <h3 className='fact-title'>Follow a Budgeting Rule</h3>
                    <p className='fact-blurb'>Following a simple rule of thumb like the 50/30/20 rule that suggests dividing your income into three categories:
                        50% for needs, 30% for wants, and 20% for savings or paying off debt.
                        It's a straightforward way to maintain financial balance without being overly restrictive.
                    </p>
                </div>

                <div className='about-cont'>
                    <h2>Meet The Team</h2>
                    {/* Write About us*/}
                    <p></p>
                    <div className='dev-card-row'>
                        <div className='dev-card'>
                            <img src="/HarryProfilePic.jpg" alt='Product Owner Harry' className='profile-img' />
                            <h3>Harry</h3>
                            <p className='dev-title'>Product Owner</p>
                            <p className='dev-about'>Harry is currently 19 years old, and is studying computer science at AUT.
                                In his spare time he enjoys listening to death metal and playing The Witcher.</p>
                        </div>
                        <div className='dev-card'>
                            <img src="/JaveriaProfilePic.jpg" alt='Scrum Master Javeria' className='profile-img' />
                            <h3>Javeria</h3>
                            <p className='dev-title'>Scrum Master</p>
                            <p className='dev-about'>Javeria is a very passionate young lady who strives on her creative freedom.
                                She loves walking under the trees on a cool summer day, but enjoys cosy nights gaming away.
                            </p>
                        </div>
                    </div>
                    <div className='dev-card-row'>
                        <div className='dev-card'>
                            <img src="/MarcosProfilePic.jpg" alt='Developer Marcos' className='profile-img' />
                            <h3>Marcos</h3>
                            <p className='dev-title'>Developer</p>
                            <p className='dev-about'>Marcos is 21 years old and he is studying Computer and Information Sciences at AUT.
                                In his spare time he enjoys going to the gym and playing video games.
                            </p>
                        </div>
                        <div className='dev-card'>
                            <img src="/NathanaelProfilePic.png" alt='Developer Nathanael' className='profile-img' />
                            <h3>Nathanael</h3>
                            <p className='dev-title'>Developer</p>
                            <p className='dev-about'>Nathanael is a 23 year old computer science student at AUT.
                                In his free time he enjoys playing videos games and watching anime.</p>
                        </div>
                        <div className='dev-card'>
                            <img src="/profile.jpg" alt='Developer Ijaz' className='profile-img' />
                            <h3>Ijaz</h3>
                            <p className='dev-title'>Developer</p>
                            <p className='dev-about'>Ijaz is 22 years old and studies Computer and Information Sciences at AUT.
                                He likes to read and play games in his spare time.</p>
                        </div>
                    </div>
                    {/* Add Image related to us */}
                </div>
            </main >
        </div >
    )
}

export default LandingPage;