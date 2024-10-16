import React, { useState } from 'react';
import './help.css';
import emailjs from 'emailjs-com';
import Navbar from './Navbar';

function HelpPage() {
    const [activeIndex, setActiveIndex] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const toggleCollapsible = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const collapsibleSections = [
        {
            title: "How To Add a New Transaction",
            content: "To add a new transaction navigate back to the home page and click on the update information page."
        },
        {
            title: "How To Analyze Your Spendings",
            content: "Look at your spendings"
        },
        {
            title: "Section 3",
            content: "Morbi vel justo nec mi convallis aliquet. Nullam dictum metus vel lectus suscipit, ut laoreet orci posuere."
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs.sendForm(
            'service_rz4plt9',  // Replace with your EmailJS service ID
            'template_q0q7mhb',  // Replace with your EmailJS template ID
            e.target,            // This passes the form data
            'MObDdRNy0sNI-J30L'  // Replace with your EmailJS user ID
        )
            .then((result) => {
                console.log(result.text);
                alert("Help request sent successfully!");
            }, (error) => {
                console.log(error.text);
                alert("Failed to send help request.");
            });
    };

    return (
        <div>
            <Navbar />
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

                            <div className={`content ${isActive ? 'active' : ''}`}>
                                <p>{section.content}</p>
                            </div>
                        </div>
                    );
                })}

                {/* Help Request Form */}
                <div className="help-request-form">
                    <h2>Submit a Help Request</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="from_name"     // Correct field name for EmailJS
                                id="from_name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="reply_to"      // Correct field name for EmailJS
                                id="reply_to"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </label>
                        <label>
                            Message:
                            <textarea
                                type="text"
                                name="message"       // Correct field name for EmailJS
                                id="message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                        </label>
                        <button type="submit">Send</button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default HelpPage;
