import React from 'react';
import './App.css'; // Import your styles if needed
import cat2 from './assets/cat2.jpg';
import angry_cat from './assets/angry_cat.jpg';
import hapi_cat from './assets/hapi_cat.jpg';
import slurp_cat from './assets/slurp_cat.jpg';

function Home() {
    return (
        <div className="home-container">
            <header>
                <hr width="80%" />
            </header>
            <h1>The Cutest Cats Ever!</h1>
            <p>Scroll down for cat content</p>
            <h2>As you can tell, they are so cute!</h2>
            <aside className="image-gallery">
                <img src={cat2} alt="Cat 2" />
                <img src={angry_cat} alt="Angry Cat" />
                <img src={hapi_cat} alt="Happy Cat" />
                <img src={slurp_cat} alt="Slurping Cat" />
            </aside>

            <section>
                <h2>Fun Facts About Cats</h2>
                <ul>
                    <li>Cats have over 20 muscles that control their ears.</li>
                    <li>Cats sleep for 70% of their lives.</li>
                    <li>Cats can make over 100 different sounds.</li>
                    <li>A group of cats is called a clowder!</li>
                    <li>Each cat's noseprint is unique, much like a human fingerprint.</li>
                </ul>
            </section>
            <footer>
                <h5>Copyright © 2024 | Javeria.com</h5>
                <a href="https://www.w3schools.com/html/html_basic.asp" target="_blank" rel="noopener noreferrer">Learn HTML Basics</a>
            </footer>
        </div>
    );
}

export default Home;
