import React, { useContext } from 'react';
import AuthForm from '../components/AuthForm';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (formData) => {
        try {
            const response = await api.post('/auth/register', formData);
            const { token, user } = response.data;

            login(user, token);
            navigate('/');
        } catch (error) {
            alert('Error al registrarse: ' + error.response?.formData?.message || 'Error desconocido');
        }
    };

    return <AuthForm type="register" onSubmit={handleRegister} />;
};

export default Register;
