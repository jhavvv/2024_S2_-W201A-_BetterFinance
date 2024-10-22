import React, { useState } from 'react';
import './help.css';
import emailjs from 'emailjs-com';

function HelpPage() {
    const [activeIndex, setActiveIndex] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const toggleCollapsible = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const collapsibleSections = [
        {
            title: "How To Add a New Transaction",
            content: "To add a new transaction navigate to the information page, by clicking on the menu on the top right of the page. From here click on the 'Update Information' button. You will now be redirected to the information page, where you can add in your information such as the income you earned, any spendings you have made and a monthly budget that you can set for the month. Just fill in the section that you want to add and click on the button at the button of that section and it will automatically be added."
        },
        {
            title: "How To Analyze Your Spendings",
            content: "Look at your spendings"
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
