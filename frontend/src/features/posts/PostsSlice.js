import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { getEnvironmentConfig } from '../../config/environments';

const env = getEnvironmentConfig();

export const createPostAsync = createAsyncThunk(
    'posts/createPost',
    async (postData, { rejectWithValue }) => {
        try {
            console.log(`[${env.name}] Creating post with data:`, postData);
            const data = await api.post('/api/posts', postData);
            console.log(`[${env.name}] Created post:`, data);
            return data;
        } catch (err) {
            console.error(`[${env.name}] Error creating post:`, err);
            return rejectWithValue(err.message);
        }
    }
);

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async (_, { rejectWithValue }) => {
        try {
            console.log(`[${env.name}] Fetching posts`);
            const data = await api.get('/api/posts');
            console.log(`[${env.name}] Fetched posts:`, data);
            return data;
        } catch (err) {
            console.error(`[${env.name}] Error fetching posts:`, err);
            return rejectWithValue(err.message);
        }
    }
);

export const deletePostAsync = createAsyncThunk(
    'posts/deletePost',
    async (postId, { rejectWithValue }) => {
        try {
            console.log(`[${env.name}] Deleting post:`, postId);
            await api.delete(`/api/posts/${postId}`);
            console.log(`[${env.name}] Successfully deleted post:`, postId);
            return postId;
        } catch (err) {
            console.error(`[${env.name}] Error deleting post:`, err);
            return rejectWithValue(err.message);
        }
    }
);

export const updatePostAsync = createAsyncThunk(
    'posts/updatePost',
    async ({ postId, postData }, { rejectWithValue }) => {
        try {
            console.log(`[${env.name}] Updating post:`, postId, 'with data:', postData);
            const data = await api.put(`/api/posts/${postId}`, postData);
            console.log(`[${env.name}] Updated post:`, data);
            return data;
        } catch (err) {
            console.error(`[${env.name}] Error updating post:`, err);
            return rejectWithValue(err.message);
        }
    }
);

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        status: 'idle',
        error: null,
        currentEnvironment: env.name
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload.map(post => ({
                    ...post,
                    environment: env.name
                }));
                state.error = null;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            
            .addCase(createPostAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createPostAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts.unshift({
                    ...action.payload,
                    environment: env.name
                });
                state.error = null;
            })
            .addCase(createPostAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            
            .addCase(deletePostAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deletePostAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = state.posts.filter(post => post.PostID !== action.payload);
                state.error = null;
            })
            .addCase(deletePostAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            
            .addCase(updatePostAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updatePostAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.posts.findIndex(post => post.PostID === action.payload.PostID);
                if (index !== -1) {
                    state.posts[index] = {
                        ...action.payload,
                        environment: env.name
                    };
                }
                state.error = null;
            })
            .addCase(updatePostAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const selectAllPosts = (state) => state.posts.posts;
export const selectPostById = (state, postId) => 
    state.posts.posts.find(post => post.PostID === postId);
export const selectPostsStatus = (state) => state.posts.status;
export const selectPostsError = (state) => state.posts.error;
export const selectCurrentEnvironment = (state) => state.posts.currentEnvironment;

export default postsSlice.reducer;