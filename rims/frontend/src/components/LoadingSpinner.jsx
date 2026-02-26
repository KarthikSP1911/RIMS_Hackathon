import React from 'react';

const LoadingSpinner = ({ message = 'Processing...' }) => (
    <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-message">{message}</p>
    </div>
);

export default LoadingSpinner;
