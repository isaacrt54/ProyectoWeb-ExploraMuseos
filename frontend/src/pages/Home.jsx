import { useEffect, useState } from 'react';
import MuseumCard from '../components/MuseumCard';
import api from '../api/axios';
import './Home.css';

// Home page that displays a list of museums
const Home = () => {
    const [museums, setMuseums] = useState([]);

    useEffect(() => {
        // Function to fetch museums from the backend
        const fetchMuseums = async () => {
            try {
                // Make the request to the backend to get the list of museums
                const response = await api.get('/museums');
                setMuseums(response.data);
            } catch (error) {
                console.error('Error fetching museums:', error);
            }
        };

        fetchMuseums();
    }, []);

    return (
        <div className="home">
            <h1 className="home_title">Bienvenido a ExploraMuseos</h1>
            {museums.map(museum => (
                <MuseumCard key={museum._id} museum={museum} />
            ))}
        </div>
    );
};

export default Home;
