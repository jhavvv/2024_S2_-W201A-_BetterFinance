/* This page was made for testing purposes and can be modified/deleted if needed */

import React from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function AboutUs() {
    const navigate = useNavigate();
    return (
        <div>
            <Navbar />
            
            <main>
                <h1>About Us</h1>
                <div className='about-cont'>
                    <h2>Meet The Team</h2>
                    {/* Write About us*/}
                    <p></p>
                    <div className='dev-card-row'>
                        <div className='dev-card'>
                            <img src="/HarryProfilePic.jpg" alt='Product Owner Harry' className='profile-img'/>
                            <h3>Harry</h3>
                            <p className='dev-title'>Product Owner</p>
                            <p className='dev-about'>Harry is currently 19 years old, and is studying computer science at AUT. 
                                In his spare time he enjoys listening to death metal and playing The Witcher.</p>
                        </div>
                        <div className='dev-card'>
                            <img src="/JaveriaProfilePic.jpg" alt='Scrum Master Javeria' className='profile-img'/>
                            <h3>Javeria</h3>
                            <p className='dev-title'>Scrum Master</p>
                            <p className='dev-about'>Javeria is a very passionate young lady who strives on her creative freedom.
                                She loves walking under the trees on a cool summer day, but enjoys cosy nights gaming away.
                            </p>
                        </div>
                    </div>
                    <div className='dev-card-row'>
                        <div className='dev-card'>
                            <img src="/MarcosProfilePic.jpg" alt='Developer Marcos' className='profile-img'/>
                            <h3>Marcos</h3>
                            <p className='dev-title'>Developer</p>
                            <p className='dev-about'>Marcos is 21 years old and he is studying Computer and Information Sciences at AUT.
                                In his spare time he enjoys going to the gym and playing video games.
                            </p>
                        </div>
                        <div className='dev-card'>
                            <img src="/NathanaelProfilePic.png" alt='Developer Nathanael' className='profile-img'/>
                            <h3>Nathanael</h3>
                            <p className='dev-title'>Developer</p>
                            <p className='dev-about'>Nathanael is a 23 year old computer science student at AUT. 
                                In his free time he enjoys playing videos games and watching anime.</p>
                        </div>
                        <div className='dev-card'>
                            <img src="/profile.jpg" alt='Developer Ijaz' className='profile-img'/>
                            <h3>Ijaz</h3>
                            <p className='dev-title'>Developer</p>
                            <p className='dev-about'>Ijaz is 22 years old and studies Computer and Information Sciences at AUT. 
                                He likes to read and play games in his spare time.</p>
                        </div>
                    </div>
                    {/* Add Image related to us */}
                </div>
            </main>
        </div>
    );
}

export default AboutUs;