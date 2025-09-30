import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaLandmark } from 'react-icons/fa';
import './Navbar.css';

// This component renders the navigation bar with links to home, login, register, and profile
const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar_brand">
                <FaLandmark />
                ExploraMuseos
            </Link>

            <div className="navbar_links">
                {user ? (
                    <>
                        <span className="navbar_greeting">Hola, {user.name}</span>
                        <Link to="/profile" className="navbar_link">Mi perfil</Link>
                        <button onClick={handleLogout} className="navbar_button">
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar_link">Iniciar sesión</Link>
                        <Link to="/register" className="navbar_link">Registrarse</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
