import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, deletePostAsync } from './PostsSlice';
import EditPostModal from './EditPostModal';

const PostsList = () => {
    const dispatch = useDispatch();
    const posts = useSelector(state => state.posts.posts);
    const status = useSelector(state => state.posts.status);
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPosts());
        }
    }, [status, dispatch]);

    const handleDelete = async (postId) => {
        if (window.confirm('Are you sure you want to archive this post?')) {
            try {
                await dispatch(deletePostAsync(postId)).unwrap();
            } catch (err) {
                console.error('Failed to archive post:', err);
            }
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post);
    };

    return (
        <div className="posts-container">
            <div className="posts-header">
                <span className="posts-count">
                    Total Posts: {posts.length}
                </span>
            </div>

            <div className="posts-table-container">
                <table className="posts-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Author</th>
                            <th className="actions-header">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts && posts.length > 0 ? (
                            posts.map((post) => (
                                <tr key={post.PostID}>
                                    <td>
                                        <div className="post-title">{post.Title}</div>
                                    </td>
                                    <td>
                                        <div className="post-content">{post.Content}</div>
                                    </td>
                                    <td>
                                        <div className="post-author">{post.Author}</div>
                                    </td>
                                    <td>
                                        <div className="post-actions">
                                            <button
                                                onClick={() => handleEdit(post)}
                                                className="edit-button"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.PostID)}
                                                className="archive-button"
                                            >
                                                Archive
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="empty-state">
                                    No posts yet. Create your first post above!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editingPost && (
                <EditPostModal
                    post={editingPost}
                    isOpen={!!editingPost}
                    onClose={() => setEditingPost(null)}
                />
            )}
        </div>
    );
};

export default PostsList;