import React from 'react';
import { Provider } from 'react-redux';
import store from './app/store';
import PostForm from './features/posts/PostForm';
import PostsList from './features/posts/PostsList';

function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <div className="content-wrapper">
          <h1>Blog App</h1>
          
          <div className="card form-card">
            <h2>New Post</h2>
            <PostForm />
          </div>

          <div className="card">
            <h2>Recent Posts</h2>
            <PostsList />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;