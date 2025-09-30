import { useEffect, useState, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import './Users.css';

// Page to manage users, allowing admins to promote and delete users
const ManageUsersPage = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    // Fetch all users from the backend
    const fetchUsers = async () => {
        try {
            // Make the request to the backend to get the list of users
            const res = await api.get('/users/admin');
            setUsers(res.data);
        } catch (err) {
            console.error('Error loading users:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Function to handle deleting a user
    const handleDelete = async (id) => {
        if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
        try {
            await api.delete(`/users/delete/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    // Function 
    const handleToggleRole = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!confirm(`¿Establecer rol de este usuario a "${newRole}"?`)) return;
        try {
            await api.put(`/users/admin/${id}`, { role: newRole });
            setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
        } catch (err) {
            console.error('Error updating user role:', err);
        }
    };

    return (
        <div className="manage-users">
            <h1 className="manage-users_title">Gestión de Usuarios</h1>
            <table className="manage-users_table">
                <thead className="manage-users_thead">
                    <tr>
                        <th className="manage-users_th">Nombre</th>
                        <th className="manage-users_th">Email</th>
                        <th className="manage-users_th">Rol</th>
                        <th className="manage-users_th-action">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.filter(u => u._id !== currentUser._id).map(u => (
                        <tr key={u._id} className="manage-users_row">
                            <td className="manage-users_cell">{u.name}</td>
                            <td className="manage-users_cell">{u.email}</td>
                            <td className="manage-users_cell manage-users_cell--capitalize">{u.role}</td>
                            <td className="manage-users_cell">
                                <div className="manage-users_actions">
                                    <button
                                        onClick={() => handleToggleRole(u._id, u.role)}
                                        className="manage-users_btn manage-users_btn-toggle"
                                    >
                                        {u.role === 'admin' ? 'Revertir a user' : 'Promover a admin'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(u._id)}
                                        className="manage-users_btn manage-users_btn-delete"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsersPage;