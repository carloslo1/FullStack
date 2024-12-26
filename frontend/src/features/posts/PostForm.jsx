import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPostAsync } from './PostsSlice';

const PostForm = () => {
    const dispatch = useDispatch();
    const status = useSelector(state => state.posts.status);
    const error = useSelector(state => state.posts.error);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createPostAsync(formData)).unwrap();
            setFormData({ title: '', content: '', author: '' });
        } catch (err) {
            console.error('Failed to create post:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="error-alert">
                    <div className="error-alert-content">
                        <div>
                            <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="error-message">{error}</div>
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="title" className="form-label">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="form-input"
                    required
                />
            </div>

            <div>
                <label htmlFor="content" className="form-label">
                    Content
                </label>
                <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="form-input"
                    required
                />
            </div>

            <div>
                <label htmlFor="author" className="form-label">
                    Author
                </label>
                <input
                    type="text"
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="form-input"
                    required
                />
            </div>

            <div>
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="submit-button"
                >
                    {status === 'loading' ? (
                        <span className="flex items-center">
                            <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Post...
                        </span>
                    ) : (
                        'Create'
                    )}
                </button>
            </div>
        </form>
    );
};

export default PostForm;