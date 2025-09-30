import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// This component checks if the user is authenticated before allowing access to certain routes
const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('token');

    // If there's no token and no user, redirect to login
    if (!token && !user) {
        return <Navigate to="/login" replace />;
    }

    // If there's a token but no user, wait for user to load
    if (token && !user) {
        return null;
    }

    // Theres a user, so return the children components
    return children;
};

export default PrivateRoute;