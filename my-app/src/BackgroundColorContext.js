// BackgroundColorContext.js
import React, { createContext, useState, useContext } from 'react';

const BackgroundColorContext = createContext();

export const BackgroundColorProvider = ({ children }) => {
    const [backgroundColor, setBackgroundColor] = useState('#ffffff'); // Default color

    return (
        <BackgroundColorContext.Provider value={{ backgroundColor, setBackgroundColor }}>
            {children}
        </BackgroundColorContext.Provider>
    );
};

export const useBackgroundColor = () => {
    return useContext(BackgroundColorContext);
};
