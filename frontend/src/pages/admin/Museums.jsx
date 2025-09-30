import { useEffect, useState } from 'react';
import api from '../../api/axios';
import './Museums.css';

// Page to manage museums, allowing admins to create, edit, and delete museums
const ManageMuseumsPage = () => {
    const [museums, setMuseums] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        webSite: '',
        image: '',
        tags: '',
    });
    const [editingId, setEditingId] = useState(null);

    // Function to fetch museums from the backend
    const fetchMuseums = async () => {
        try {
            // Make the request to the backend to get the list of museums
            const res = await api.get('/museums');
            setMuseums(res.data);
        } catch (err) {
            console.error('Error loading museums:', err);
        }
    };

    useEffect(() => {
        fetchMuseums();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Function to handle editing a museum,
    // this sets the form data to the museum's current values for editing
    const handleEdit = (m) => {
        setEditingId(m._id);
        setFormData({
            name: m.name,
            description: m.description,
            location: m.location,
            webSite: m.webSite,
            image: m.image,
            tags: m.tags.join(', '),
        });
    };

    // Function to cancel editing,
    // this resets the form data and clears the editing ID
    const handleCancelEdit = () => {
        setFormData({
            name: '',
            description: '',
            location: '',
            webSite: '',
            image: '',
            tags: '',
        });
        setEditingId(null);
    };

    // Function to handle form submission,
    // this either creates a new museum or updates an existing one based on the editing ID
    const handleSubmit = async (e) => {
        e.preventDefault();
        const tagsArray = formData.tags.split(',').map((t) => t.trim());
        try {
            if (editingId) {
                await api.put(`/museums/edit/${editingId}`, { ...formData, tags: tagsArray });
            } else {
                await api.post('/museums', { ...formData, tags: tagsArray });
            }
            handleCancelEdit();
            fetchMuseums();
            alert(editingId ? 'Museo actualizado correctamente' : 'Museo creado correctamente');
        } catch (err) {
            console.error(editingId ? 'Error updating museum:' : 'Error creating museum:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este museo?')) return;
        try {
            await api.delete(`/museums/delete/${id}`);
            setMuseums(museums.filter((m) => m._id !== id));
        } catch (err) {
            console.error('Error deleting museum:', err);
        }
    };

    return (
        <div className="manage-museums">
            <h1 className="text-2xl font-bold mb-6">Gestionar Museos</h1>

            <form onSubmit={handleSubmit} className="manage-museums_form">
                <h2 className="text-lg font-semibold">
                    {editingId ? 'Editar museo' : 'Agregar nuevo museo'}
                </h2>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nombre"
                    className="manage-museums_input"
                    required
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descripción"
                    className="manage-museums_textarea"
                    required
                />
                <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ubicación"
                    className="manage-museums_input"
                    required
                />
                <input
                    name="webSite"
                    value={formData.webSite}
                    onChange={handleChange}
                    placeholder="Sitio web"
                    className="manage-museums_input"
                    required
                />
                <input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="URL de imagen"
                    className="manage-museums_input"
                    required
                />
                <input
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Tags (separados por coma)"
                    className="manage-museums_input"
                    required
                />

                <div className="manage-museums_form-group">
                    <button type="submit" className="manage-museums_btn manage-museums_btn-primary">
                        {editingId ? 'Guardar cambios' : 'Agregar museo'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={handleCancelEdit} className="manage-museums_btn manage-museums_btn-cancel">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <div className="manage-museums_list">
                <h2 className="manage-museums_list-title">Lista de museos</h2>
                {museums.map((m) => (
                    <div key={m._id} className="manage-museums_card">
                        <div>
                            <h3 className="manage-museums_card-info-title">{m.name}</h3>
                            <p className="manage-museums_card-info-text">{m.location}</p>
                        </div>
                        <div className="manage-museums_card-actions">
                            <button onClick={() => handleEdit(m)} className="manage-museums_btn manage-museums_btn-edit">
                                Editar
                            </button>
                            <button onClick={() => handleDelete(m._id)} className="manage-museums_btn manage-museums_btn-delete">
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageMuseumsPage;
