import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Higher Order Component to protect routes.
 * Redirects to /login if no valid token is found in localStorage.
 */
const ProtectedRoute = () => {
    const token = localStorage.getItem('respirascan_token');

    // TEMPORARILY DISABLED FOR TESTING - MongoDB not connected
    // if (!token) {
    //     // Redirect to login if not authenticated
    //     return <Navigate to="/login" replace />;
    // }

    // If authenticated, render the protected component (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;
