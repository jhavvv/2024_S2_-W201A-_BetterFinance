import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './help.css';

function HelpPage() {
    const [activeIndex, setActiveIndex] = useState(null); // State to track which tab is open

    const toggleCollapsible = (index) => {
        setActiveIndex(activeIndex === index ? null : index); // Toggle between opening and closing
    };

    const collapsibleSections = [
        {
            title: "How To Add a New Transaction",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum."
        },
        {
            title: "How To Analyze Your Spendings",
            content: "Curabitur ut eros non enim posuere efficitur. Fusce eget tortor urna."
        },
        {
            title: "Section 3",
            content: "Morbi vel justo nec mi convallis aliquet. Nullam dictum metus vel lectus suscipit, ut laoreet orci posuere."
        }
    ];

    return (
        <div>
            <header>
                <div id="navbar">
                    <a href="transactions.html" title="Transactions">Transactions</a>
                    <a href="information.html" title="Information">Information</a>
                    <a href="graphs.html" title="Graphs">Graphs</a>
                    <p><Link to="/">Help</Link></p>
                </div>
            </header>

            <main>
                <div id="Title" className="title">
                    <h1>Frequently Asked Questions</h1>
                </div>

                {/* Accordion Sections */}
                {collapsibleSections.map((section, index) => {
                    const isActive = activeIndex === index;

                    return (
                        <div key={index}>
                            <button
                                type="button"
                                className={`collapsible ${isActive ? 'active' : ''}`}
                                onClick={() => toggleCollapsible(index)}
                            >
                                {section.title}
                            </button>

                            <div
                                className={`content ${isActive ? 'active' : ''}`}
                            >
                                <p>{section.content}</p>
                            </div>
                        </div>
                    );
                })}
            </main>
        </div>
    );
}

export default HelpPage;
