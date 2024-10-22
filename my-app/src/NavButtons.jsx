import React from 'react';

const NavButtons = ({ cssName, navigate, text }) => {
    return (
        <button className={cssName} onClick={navigate}>
            {text}
        </button>
    );
}

export default NavButtons;
