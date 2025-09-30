import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// This component checks if the user is an admin before allowing access to certain routes
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  // If there's no token and no user, redirect to login
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  // If there's a token but no user, wait for user to load
  if (token && !user) {
    return (null);
  }

  // If the user is not an admin, redirect to home
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // The user is an admin, so return the children components
  return children;
};

export default AdminRoute;