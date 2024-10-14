import React, { useState } from 'react';
import axios from 'axios';

function GoogleSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (query.trim()) {
            try {
                const apiKey = 'AIzaSyB-quvLBsvQBw1qWflzAY3YIGvkk05CclY'; // Replace with your actual API key
                const searchEngineId = 'd479c64ae589f4dc5'; // Replace with your actual search engine ID

                const response = await axios.get(
                    `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${searchEngineId}`
                );

                setResults(response.data.items || []);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }
    };

    return (
        <div>
            <h1>Google Search</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter search keyword..."
                    required
                />
                <button type="submit">Search</button>
            </form>

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

export default GoogleSearch;
