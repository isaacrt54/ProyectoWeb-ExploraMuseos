import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Initialize user state from localStorage on component mount
    useEffect(() => {
        try {
            const storedUserString = localStorage.getItem('user');
            const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
            const token = localStorage.getItem('token');

            if (storedUser && token) {
                setUser(storedUser);
            }
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            // If there's an error parsing the user, clear localStorage
            // to avoid issues with corrupted data
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
