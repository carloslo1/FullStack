const express = require('express');
const cors = require('cors');
const path = require('path'); 
const { sql, poolPromise } = require('./db');
const app = express();

require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '../frontend/dist')));


app.use(cors());

app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url} (${process.env.NODE_ENV})`);
    if (process.env.NODE_ENV !== 'production') {
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        if (req.body && Object.keys(req.body).length > 0) {
            console.log('Body:', JSON.stringify(req.body, null, 2));
        }
    }
    next();
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString() 
    });
});

app.post('/api/posts', async (req, res) => {
    const { title, content, author } = req.body;
    console.log(`[${process.env.NODE_ENV}] Creating new post:`, { title, content, author });
    
    try {
        if (!title || !content || !author) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['title', 'content', 'author'],
                received: { title: !!title, content: !!content, author: !!author }
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('Title', sql.NVarChar(255), title)
            .input('Content', sql.Text, content)
            .input('Author', sql.NVarChar(100), author)
            .execute('CreatePost');
            
        const newPost = {
            PostID: result.recordset[0].NewPostID,
            Title: title,
            Content: content,
            Author: author,
            CreatedAt: new Date(),
            UpdatedAt: null,
            IsDeleted: false,
            Environment: process.env.NODE_ENV
        };
        
        console.log(`[${process.env.NODE_ENV}] Post created successfully:`, newPost);
        res.status(201).json(newPost);
    } catch (err) {
        console.error(`[${process.env.NODE_ENV}] Error creating post:`, err);
        res.status(500).json({ 
            error: err.message,
            details: process.env.NODE_ENV !== 'production' ? err.stack : undefined
        });
    }
});

app.get('/api/posts', async (req, res) => {
    console.log(`[${process.env.NODE_ENV}] Fetching all posts`);
    try {
        const pool = await poolPromise;
        const result = await pool.request().execute('GetAllPosts');
        console.log(`[${process.env.NODE_ENV}] Successfully fetched ${result.recordset.length} posts`);
        
        const postsWithEnv = result.recordset.map(post => ({
            ...post,
            Environment: process.env.NODE_ENV
        }));
        
        res.json(postsWithEnv);
    } catch (err) {
        console.error(`[${process.env.NODE_ENV}] Error fetching posts:`, err);
        res.status(500).json({ 
            error: err.message,
            details: process.env.NODE_ENV !== 'production' ? err.stack : undefined
        });
    }
});

app.put('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, author } = req.body;
    console.log(`[${process.env.NODE_ENV}] Updating post ${id}:`, { title, content, author });
    
    try {
        if (!title || !content || !author) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['title', 'content', 'author'],
                received: { title: !!title, content: !!content, author: !!author }
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('PostID', sql.Int, id)
            .input('Title', sql.NVarChar(255), title)
            .input('Content', sql.Text, content)
            .input('Author', sql.NVarChar(100), author)
            .execute('UpdatePostByID');
            
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ 
                error: `Post with ID ${id} not found`,
                environment: process.env.NODE_ENV 
            });
        }
            
        const updatedPost = { 
            PostID: parseInt(id), 
            Title: title, 
            Content: content, 
            Author: author,
            UpdatedAt: new Date(),
            Environment: process.env.NODE_ENV
        };
        
        console.log(`[${process.env.NODE_ENV}] Post updated successfully:`, updatedPost);
        res.json(updatedPost);
    } catch (err) {
        console.error(`[${process.env.NODE_ENV}] Error updating post:`, err);
        res.status(500).json({ 
            error: err.message,
            details: process.env.NODE_ENV !== 'production' ? err.stack : undefined
        });
    }
});

app.delete('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`[${process.env.NODE_ENV}] Deleting post ${id}`);
    
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('PostID', sql.Int, id)
            .execute('DeletePostByID');
            
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ 
                error: `Post with ID ${id} not found`,
                environment: process.env.NODE_ENV 
            });
        }
        
        console.log(`[${process.env.NODE_ENV}] Successfully deleted post ${id}`);
        res.status(204).send();
    } catch (err) {
        console.error(`[${process.env.NODE_ENV}] Error deleting post:`, err);
        res.status(500).json({ 
            error: err.message,
            details: process.env.NODE_ENV !== 'production' ? err.stack : undefined
        });
    }
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(`[${process.env.NODE_ENV}] Unhandled error:`, err);
    res.status(500).json({
        error: err.message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
        environment: process.env.NODE_ENV
    });
});

const PORT = process.env.API_PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('\n' + '='.repeat(50));
    console.log(`🚀 Server running in ${process.env.NODE_ENV.toUpperCase()} mode`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 Database: ${process.env.DB_DATABASE}`);
    console.log(`➡️ Health check: http://localhost:${PORT}/api/health`);
    console.log(`➡️ API endpoint: http://localhost:${PORT}/api/posts`);
    console.log('='.repeat(50) + '\n');
    console.log('Waiting for requests...\n');
});