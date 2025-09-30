import { Link } from 'react-router-dom';
import './MuseumCard.css';

// This component displays a card for each museum with its image, name, description, and tags
const MuseumCard = ({ museum }) => {
    return (
        <div className="museum-card">
            <div
                className="museum-card_image"
                style={{ backgroundImage: `url(${museum.image})` }}
            ></div>

            <div className="museum-card_content">
                <h3 className="museum-card_title">{museum.name}</h3>
                <p className="museum-card_description">{museum.description}</p>
                <div className="museum-card_tags">
                    {museum.tags.map((tag, index) => (
                        <span key={index} className="museum-card_tag">{tag}</span>
                    ))}
                </div>

                <div className="mt-4">
                    <Link
                        to={`/museums/${museum._id}`}
                        className="museum-card_link"
                    >
                        Ver más
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MuseumCard;
