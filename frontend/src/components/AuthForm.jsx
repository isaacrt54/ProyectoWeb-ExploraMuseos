import { useState } from 'react';
import './AuthForm.css';

// Component for user authentication forms (login or registration)
const AuthForm = ({
    type = 'login',
    onSubmit,
    loading = false,
    error = ''
}) => {
    const isLogin = type === 'login';
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    // Function to handle input changes and update form data state
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="auth-form">
            <h2 className="auth-form_title">
                {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </h2>
            <form onSubmit={handleSubmit} className="auth-form_form">
                {!isLogin && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        className="auth-form_input"
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    className="auth-form_input"
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    className="auth-form_input"
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                {error && (
                    <p className="auth-form_error">{error}</p>
                )}
                <button
                    type="submit"
                    className="auth-form_button"
                    disabled={loading}
                >
                    {loading && <span className="auth-form_spinner" />}
                    {isLogin ? (loading ? 'Ingresando...' : 'Ingresar') : (loading ? 'Registrando...' : 'Registrarse')}
                </button>
            </form>
        </div>
    );
};

export default AuthForm;