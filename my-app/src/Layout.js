// Layout.js
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, setBackgroundColor }) => {
    return (
        <>
            <Navbar setBackgroundColor={setBackgroundColor} />
            <main>{children}</main>
        </>
    );
};

export default Layout;
