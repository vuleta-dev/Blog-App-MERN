const Blog = require('../models/blog');
const mongoose = require('mongoose');
const multer = require('multer');

// New blog post
const newBlogPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        // get user id
        const userId = req.user.id;

        // Check title
        if (!title) {
            return res.json({ error: 'Title is required!' });
        }

        // Check content
        if (!content) {
            return res.json({ error: 'Content is required' });
        }

        // Check if file is present
        if (!req.file) {
            return res.json({ error: 'Image is required' });
        }

        // Create new blog post
        const blog = await Blog.create({
            title,
            content,
            image: req.file.originalname,
            author: userId
        });

        return res.json(blog);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Edit blog post
const editBlogPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;

        const postId = req.params.id;

        const existingBlog = await Blog.findById(postId);

        if (!existingBlog) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        // Check blog post author
        if (existingBlog.author.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to edit this post' });
        }

        // New data
        existingBlog.title = title;
        existingBlog.content = content;

        // New image (if)
        if (req.file) {
            existingBlog.image = req.file.originalname;
        }

        await existingBlog.save();

        return res.json(existingBlog);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Get all blog posts
const getAllPosts = async (req, res) => {
    const blogPosts = await Blog.find({});
    res.status(200).json(blogPosts)
}


// Get single blog post (auth req)
const getBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const post = await Blog.findById(id)

        if (!post) {
            return res.status(404).json({ message: 'Not found' })
        }

        if (post.author === userId) {
            res.json(post)
        } else {
            return res.status(403).json({ error: 'Forbidden: You are not the author of this post' });

        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
}

// Delete Blog post
const deleteBlogPost = async (req, res) => {
    try {
        const userID = req.user.id;
        const { id } = req.params;

        const existingBlog = await Blog.findById(id);

        if (!existingBlog) {
            return res.status(404).json({ error: "Post not found!" });
        }

        if (existingBlog.author === userID) {
            await Blog.deleteOne({ _id: id });
            return res.json({ message: "Blog post deleted successfully!" });
        } else {
            return res.status(403).json({ error: 'You are not authorized to delete this post' });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Get single blog post (no auth req)
const getBlogPostDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Blog.findById(id)

        if (!post) {
            return res.status(404).json({ message: 'Not found' })
        }
        res.json(post)

    } catch (error) {

    }
}

module.exports = { newBlogPost, getAllPosts, getBlogPost, editBlogPost, deleteBlogPost, getBlogPostDetails };
