import React from 'react';
import './Modal.css';

const Modal = ({ show, onClose }) => {
    if (!show) return null; // if show is false, don't display the modal

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Reminder</h3>
                <p>It’s been more than 24 hours since your last transaction. Please update or add information.</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
