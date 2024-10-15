import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

function Savings() {
    const [results, setResults] = useState([]);
    const [selectedKeyword, setSelectedKeyword] = useState(''); // State for selected keyword

    const handleSearch = async (keyword) => {
        if (keyword) {
            try {
                const apiKey = 'AIzaSyB-quvLBsvQBw1qWflzAY3YIGvkk05CclY'; // Replace with your actual API key
                const searchEngineId = 'd479c64ae589f4dc5'; // Replace with your actual search engine ID

                const response = await axios.get(
                    `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(keyword)}&key=${apiKey}&cx=${searchEngineId}`
                );

                setResults(response.data.items || []);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }
    };

    const handleDropdownChange = (e) => {
        const keyword = e.target.value;
        setSelectedKeyword(keyword); // Update selected keyword state
        if (keyword) {
            handleSearch(keyword); // Trigger search with selected keyword
        }
    };

    return (
        <div>
            <header>
                <Navbar />
            </header>

            <h1>Search for Saving Tools and Strategies</h1>

            {/* Dropdown for predefined search keywords */}
            <div className="dropdown-container">
                <select onChange={handleDropdownChange} value={selectedKeyword}>
                    <option value="">Select a topic</option>
                    <option value="Investment Strategies">Investment Strategies</option>
                    <option value="Saving Money">Saving Money</option>
                    <option value="Spending Wisely">Spending Wisely</option>
                </select>
            </div>

            {/* Display selected keyword */}
            {selectedKeyword && (
                <p style={{ marginTop: '10px' }}>
                    You searched for: <strong>{selectedKeyword}</strong>
                </p>
            )}

            {/* Display search results */}
            {results.length > 0 && (
                <div>
                    <h2>Search Results:</h2>
                    <ul>
                        {results.map((item) => (
                            <li key={item.link}>
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                    {item.title}
                                </a>
                                <p>{item.snippet}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Savings;
