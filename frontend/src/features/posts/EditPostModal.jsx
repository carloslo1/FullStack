import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePostAsync } from './PostsSlice';

const EditPostModal = ({ post, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const status = useSelector(state => state.posts.status);
    const error = useSelector(state => state.posts.error);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: ''
    });

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.Title,
                content: post.Content,
                author: post.Author
            });
        }
    }, [post]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updatePostAsync({
                postId: post.PostID,
                postData: {
                    title: formData.title,
                    content: formData.content,
                    author: formData.author
                }
            })).unwrap();
            onClose();
        } catch (err) {
            console.error('Failed to update post:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">Edit Post</h2>
                    <button
                        onClick={onClose}
                        className="modal-close-button"
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="modal-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div>
                        <label htmlFor="title" className="modal-label">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="modal-input"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="modal-label">
                            Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={4}
                            className="modal-textarea"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="author" className="modal-label">
                            Author
                        </label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="modal-input"
                            required
                        />
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="modal-cancel-button"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="modal-submit-button"
                        >
                            {status === 'loading' ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPostModal;