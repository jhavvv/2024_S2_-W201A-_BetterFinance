import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function SuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Extract the success message type from the state
    const { messageType } = location.state || { messageType: 'Operation' };

    return (
        <div>
            <h1>{messageType} successfully added!</h1>
            <button onClick={() => navigate(-1)}>Go Back</button> {/* Navigate back to the previous page */}
        </div>
    );
}

export default SuccessPage;
