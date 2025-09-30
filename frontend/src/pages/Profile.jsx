import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './Profile.css';

const Profile = () => {
    const { user, login } = useContext(AuthContext);
    const [biography, setBio] = useState(user.biography || '');
    const [editingBio, setEditingBio] = useState(false);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [followedMuseums, setFollowedMuseums] = useState([]);

    useEffect(() => {
        // Fetch user's bio when the component mounts
        const fetchUserBio = async () => {
            try {
                // Make the request to the backend to get user data
                const res = await api.get(`/users/bio/${user._id}`);
                const data = res.data;
                setBio(data.biography || '');
            } catch (error) {
                console.error('Error fetching user bio:', error);
            }
        };
        // Fetch user's followed museums when the component mounts
        const fetchFollowedMuseums = async () => {
            try {
                // Make the request to the backend to get followed museums
                const res = await api.get('/users/followed');
                const data = res.data.followedMuseums ?? res.data;
                setFollowedMuseums(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching followed museums:', error);
            }
        };
        fetchUserBio();
        fetchFollowedMuseums();
    }, [user]);

    // Function to change the user's bio
    const handleChangeBio = async () => {
        try {
            // Make the request to update the user's bio
            const res = await api.put('/users/bio', { biography });
            // Update user context with new bio
            login({ ...user, biography: res.data.biography }, localStorage.getItem('token'));
            setEditingBio(false);
        } catch (error) {
            console.error('Error updating bio:', error);
        }
    };

    // Function to handle password change
    const handleChangePassword = async () => {
        try {
            // Make the request to change the user's password
            await api.put('/users/password', { password, newPassword });
            alert('Contraseña actualizada');
            setPassword('');
            setNewPassword('');
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Error al actualizar la contraseña');
        }
    }

    return (
        <div className='profile'>
            <h1 className='profile-title'>Perfil de { user.name }</h1>

            <div className='profile-section'>
                <h2 className='section-title'>Biografía</h2>
                {editingBio ? (
                    <>
                        <textarea
                            className='input'
                            rows='3'
                            value={biography}
                            onChange={(e) => setBio(e.target.value)}
                        />
                        <button
                            className='button button-save'
                            onClick={handleChangeBio}
                        >
                            Guardar
                        </button>
                    </>
                ) : (
                    <div>
                        <p className='text-gray'>{biography || '¡Personaliza tu biografía!'}</p>
                        <button
                            className='button button-edit'
                            onClick={() => setEditingBio(true)}
                        >
                            Editar biografía
                        </button>
                    </div>
                )}
            </div>

            <div className="profile-section">
                <h2 className="text-lg font-semibold mb-2">Museos que sigues</h2>
                {followedMuseums.length === 0 ? (
                    <p className="text-gray-secondary">No estás siguiendo ningún museo aún.</p>
                ) : (
                    <ul className="list">
                        {followedMuseums.map((m) => (
                            <li key={m._id}>
                                <Link to={`/museums/${m._id}`} className="link">
                                    {m.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {user.role === 'admin' && (
                <div className="profile-section">
                     <h2 className="text-lg font-semibold mb-2">Admin</h2>
                     <div className="flex flex-col gap-2">
                        <Link to="/admin/users" className="link">Gestionar usuarios</Link>
                        <Link to="/admin/museums" className="link">Gestionar museos</Link>
                     </div>
                 </div>
             )}

            <div className="profile-section">
                 <h2 className="text-lg font-semibold mb-2">Cambiar contraseña</h2>
                 <input
                     type="password"
                     placeholder="Contraseña actual"
                     className="input"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                 /> 
                 <input
                     type="password"
                     placeholder="Nueva contraseña"
                     className="input"
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                 />
                <button
                    onClick={handleChangePassword}
                    className="button button-password"
                 >
                     Cambiar contraseña
                 </button>
             </div>
         </div>
    );
};

export default Profile;
