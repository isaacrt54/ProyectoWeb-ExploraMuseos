import { useContext } from 'react';
import AuthForm from '../components/AuthForm';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// This component handles user login functionality
const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Function to handle login form submission
    const handleLogin = async (data) => {
        const { email, password } = data;

        if (!email || !password) {
            return alert('Por favor completa todos los campos.');
        }

        try {
            // Make API request to login
            const response = await api.post('/auth/login', data);
            const { token, user } = response.data;
            // Store user data and token in context
            login(user, token);
            navigate('/');
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al iniciar sesión.';
            alert(msg);
        }
    };

    return <AuthForm type="login" onSubmit={handleLogin} />;
};

export default Login;
