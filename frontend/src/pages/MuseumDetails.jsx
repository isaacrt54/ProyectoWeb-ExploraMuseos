import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import './MuseumDetails.css';

const MuseumDetails = () => {
    const { museumId } = useParams();
    // Get the authenticated user from context
    const { user } = useContext(AuthContext);
    const [museum, setMuseum] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [post, setPost] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [newComment, setNewComment] = useState({});
    const [editingPostId, setEditingPostId] = useState(null);
    const [editPostContent, setEditPostContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState({});

    // Fetch comments for a specific post
    const fetchCommentsByPost = async (postId) => {
        try {
            const res = await api.get(`/comments/${postId}`);
            return res.data;
        } catch (error) {
            console.error('Error loading comments:', error);
            return [];
        }
    };

    useEffect(() => {
        // Fetch museum details and posts/comments
        const fetchMuseum = async () => {
            try {
                // Make the request to get museum details
                const res = await api.get(`/museums/${museumId}`);
                setMuseum(res.data);
            } catch (error) {
                console.error('Error loading museum:', error);
            }
        };
        // Fetch posts and their comments for the museum
        const fetchPost = async () => {
            try {
                // Make the request to get posts for the museum
                const res = await api.get(`/posts/${museumId}`);
                const postsData = res.data;
                const postsWithComments = await Promise.all(
                    postsData.map(async postItem => ({
                        ...postItem,
                        comments: await fetchCommentsByPost(postItem._id)
                    }))
                );
                setPost(postsWithComments);
            } catch (error) {
                console.error('Error loading posts or comments:', error);
            }
        };

        // Check if the user is following the museum
        const checkFollowing = async () => {
            try {
                // Make the request to get followed museums for the user
                const res = await api.get('/users/followed');
                const list = res.data.followedMuseums || [];
                const followedIds = list.map(m => m._id.toString());
                setIsFollowing(followedIds.includes(museumId));
            } catch (error) {
                console.error('Error checking following status:', error);
            }
        };

        fetchMuseum();
        fetchPost();
        // If the user is logged in, check if they follow the museum
        if (user) checkFollowing();
    }, [museumId, user]);

    // Function to toggle follow status of the museum
    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                // Make a DELETE request to unfollow the museum
                await api.delete(`/users/followed/${museumId}`);
                setIsFollowing(false);
            } else {
                // Make a POST request to follow the museum
                await api.post(`/users/followed/${museumId}`);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error('Error toggling follow status:', error);
            alert('Error al seguir/dejar de seguir el museo.');
        }
    };

    // Function to create a new post
    const handleCreatePost = async () => {
        if (!newPost.trim()) return;
        try {
            const res = await api.post(
                `/posts/${museumId}`,
                { content: newPost },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            // Add the new post to the state, initializing comments as an empty array
            setPost(prev => [{ ...res.data.post, comments: [] }, ...prev]);
            setNewPost('');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    // Function to add a new comment to a post
    const handleAddComment = async (postId) => {
        const content = newComment[postId]?.trim();
        if (!content) return;

        try {
            // Make a POST request to create a new comment
            const res = await api.post(
                `/comments/${postId}`,
                { content },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            // Add the new comment to the post's comments array
            const updatedComments = await fetchCommentsByPost(postId);
            setPost(prev => 
                prev.map(p => 
                    p._id === postId
                        ? { ...p, comments: updatedComments }
                        : p
                )
            );

            setNewComment(prev => ({ ...prev, [postId]: '' }));
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    // Function to enable editing mode for a post
    const startEditPost = (post) => {
        setEditingPostId(post._id);
        setEditPostContent(post.content);
    };
    
    // Function to save edited post content
    const saveEditPost = async (postId) => {
        try {
            await api.put(`/posts/edit/${postId}`, { content: editPostContent });
            setPost(prev => prev.map(p => p._id === postId ? { ...p, content: editPostContent } : p));
            setEditingPostId(null);
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };
    
    // Function to delete a post by ID
    const deletePostById = async (postId) => {
        try {
            await api.delete(`/posts/delete/${postId}`);
            setPost(prev => prev.filter(p => p._id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };
    
    // Function to enable editing mode for a comment
    const startEditComment = (comment) => {
        setEditingCommentId(comment._id);
        setEditCommentContent({ [comment._id]: comment.content });
    };
    
    // Function to save edited comment content
    const saveEditComment = async (commentId, postId) => {
        try {
            // Make a PUT request to update the comment
            await api.put(`/comments/edit/${commentId}`, { content: editCommentContent[commentId] });
            const updatedComments = await fetchCommentsByPost(postId);
            setPost(prev => prev.map(p => p._id === postId ? { ...p, comments: updatedComments } : p));
            setEditingCommentId(null);
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };
    
    // Function to delete a comment by ID
    const deleteCommentById = async (commentId, postId) => {
        try {
            // Make a DELETE request to remove the comment
            await api.delete(`/comments/delete/${commentId}`);
            const updatedComments = await fetchCommentsByPost(postId);
            setPost(prev => prev.map(p => p._id === postId ? { ...p, comments: updatedComments } : p));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    if (!museum) return <p className="text-center mt-6">Cargando...</p>;

    return (
        <div className="museum-details">
            <div className="museum-details__header">
                {/* Background image*/}
                <div
                    className="museum-details__image"
                    style={{ backgroundImage: `url(${museum.image})` }}
                ></div>
                {/* Museum name and tags */}
                <h1 className="museum-details__name">
                    <a
                        href={museum.webSite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="museum-details__name-link"
                    >
                        {museum.name}
                    </a>
                </h1>
                <div className="museum-details__tags">
                    {museum.tags?.map(tag => (
                        <span key={tag} className="museum-details__tag">
                            #{tag}
                        </span>
                    ))}
                </div>
                {/* Museum description and location */}
                <p className="museum-details__description">{museum.description}</p>
                <p className="museum-details__location"><strong>Dirección:</strong> {museum.location}</p>
                {/* Embed Google Maps iframe (API)*/}
                <iframe
                    width="100%"
                    height="300"
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(museum.name)}`}
                    title="Ubicación del museo"
                />
                {/* Follow/Unfollow button */}
                {user && (
                    <button
                        onClick={handleFollowToggle}
                        className={`museum-details__follow-button ${isFollowing ? 'museum-details__follow-button--unfollow' : 'museum-details__follow-button--follow'}`}
                    >
                        {isFollowing ? 'Dejar de seguir' : 'Seguir museo'}
                    </button>
                )}
            </div>
            {/* Museum posts section */}
            <div className="museum-details__posts">
                <h2 className="museum-details__posts-title">Publicaciones</h2>
                {/* New post form if the user is following the museum */}
                {isFollowing && user && (
                    <div className="museum-details__new-post-form">
                        <textarea
                            className="museum-details__new-post-textarea"
                            rows="3"
                            placeholder="Escribe una publicación..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                        />
                        <button
                            onClick={handleCreatePost}
                            className="museum-details__new-post-button"
                        >
                            Publicar
                        </button>
                    </div>
                )}
                {post.length === 0 ? (
                    <p>No hay publicaciones en este museo aún.</p>
                ) : (
                    post.map(post => (
                        <div key={post._id} className="museum-details__post">
                            {/* Head with name and date */}
                            <div className="museum-details__post-header">
                                <p
                                    className="museum-details__post-author"
                                    title={post.author.biography || ''}
                                >
                                    {post.author.name}
                                </p>
                                <p className="museum-details__post-date">{new Date(post.date).toLocaleDateString()}</p>
                            </div>
                            <p className="museum-details__post-content">{post.content}</p>
                            {/* Edit/Delete post if the user is the author */}
                            {user && post.author._id.toString() === user._id && (
                                editingPostId === post._id ? (
                                    <div>
                                        <textarea
                                            className="museum-details__edit-textarea"
                                            rows="3"
                                            value={editPostContent}
                                            onChange={(e) => setEditPostContent(e.target.value)}
                                         />
                                        <button
                                            onClick={() => saveEditPost(post._id)}
                                            className="museum-details__edit-button-primary"
                                         >
                                            Guardar
                                         </button>
                                        <button
                                            onClick={() => setEditingPostId(null)}
                                            className="museum-details__edit-button-secondary"
                                         >
                                            Cancelar
                                         </button>
                                    </div>
                                 ) : (
                                    <div className="museum-details__post-actions">
                                         <button aria-label="Editar publicación"
                                            onClick={() => startEditPost(post)}
                                         >
                                            <FaPencilAlt />
                                         </button>
                                         <button aria-label="Eliminar publicación"
                                            onClick={() => deletePostById(post._id)}
                                         >
                                            <FaTrashAlt />
                                         </button>
                                     </div>
                                 )
                             )}
                            {post.comments ? (
                                 post.comments.length > 0 ? (
                                    <div className="museum-details__comments">
                                         <p className="font-semibold text-sm">Comentarios:</p>
                                         {post.comments.slice().reverse().map(comment => (
                                             <div key={comment._id}>
                                                 {editingCommentId === comment._id ? (
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="Editar comentario..."
                                                            className="museum-details__comment-input"
                                                            value={editCommentContent[comment._id] || ''}
                                                            onChange={e =>
                                                                setEditCommentContent({ [comment._id]: e.target.value })
                                                            }
                                                        />
                                                        <button
                                                            onClick={() => saveEditComment(comment._id, post._id)}
                                                            className="museum-details__edit-button-primary"
                                                         >
                                                            Guardar
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingCommentId(null)}
                                                            className="museum-details__edit-button-secondary"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="museum-details__comment">
                                                         <div>
                                                            <span
                                                                className="museum-details__comment-author"
                                                                title={comment.author.biography || ''}
                                                            >
                                                                {comment.author.name}:
                                                            </span> {comment.content}
                                                        </div>
                                                        {user && comment.author._id === user._id && (
                                                            <div className="museum-details__comment-actions">
                                                                <button aria-label="Editar comentario" onClick={() => startEditComment(comment)}>
                                                                    <FaPencilAlt />
                                                                </button>
                                                                <button aria-label="Eliminar comentario" onClick={() => deleteCommentById(comment._id, post._id)}>
                                                                    <FaTrashAlt />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="museum-details__comments-title">No hay comentarios en esta publicación aún.</p>
                                )
                            ) : null}
                            {user && (
                                <div>
                                     <input
                                        type="text"
                                        placeholder="Escribe un comentario..."
                                        className="museum-details__comment-input"
                                        value={newComment[post._id] || ''}
                                        onChange={e =>
                                            setNewComment(prev => ({ ...prev, [post._id]: e.target.value }))
                                        }
                                    />
                                    <button
                                        onClick={() => handleAddComment(post._id)}
                                        className="museum-details__comment-button"
                                    >
                                        Comentar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MuseumDetails;
