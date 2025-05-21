const { validationResult } = require("express-validator");
const Post = require("../models/post.model");

async function createPost(req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ success: false, errors: validationErrors.array() });
    }

    try {
        const { title, content, category, tags } = req.body;
        const user_id = req.user.id;

        const newPost = await Post.create({
            title,
            content,
            category,
            tags,
            user_id
        });

        return res.status(201).json({ success: true, message: 'Post created Successfully', newPost });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

async function updatePost(req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ success: false, errors: validationErrors.array() });
    }

    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const existingPost = await Post.findById(postId);

        if (!existingPost) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        if (existingPost.user_id.toString() !== userId) {
            return res.status(403).json({ success: false, error: "Unauthorized" });
        }

        const { title, content, category, tags } = req.body;

        if (title !== undefined) existingPost.title = title;
        if (content !== undefined) existingPost.content = content;
        if (category !== undefined) existingPost.category = category;
        if (tags !== undefined) existingPost.tags = tags;

        const updatedPost = await existingPost.save();

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost
        });

    } catch (error) {
        console.error("Update Post Error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

async function deletePost(req, res) {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const existingPost = await Post.findById(postId);

        if (!existingPost) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        if (existingPost.user_id.toString() !== userId) {
            return res.status(403).json({ success: false, error: "Unauthorized" });
        }

        await Post.findByIdAndDelete(postId); 
        return res.status(200).json({ success: true, message: 'Post deleted successfully' });

    } catch (error) {
        console.error('Error in deletePost:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

async function getAllPosts(req, res) {
    const { term } = req.query;

    try {
        let posts;
        if (term) {
            
            posts = await Post.find({ tags: { $regex: new RegExp(`^${term}$`, 'i') } })
                .sort({ createdAt: -1 })
                .select("-__v");
        } else {
            posts = await Post.find()
                .sort({ createdAt: -1 })
                .select("-__v");
        }

        return res.status(200).json({
            success: true,
            count: posts.length,
            posts
        });
    } catch (error) {
        console.error('Error in getAllPosts:', error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}


async function getPost(req, res) {
    const postId = req.params.id;

    try {
        const existingPost = await Post.findById(postId);

        if (!existingPost) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        const post = await Post.findById(postId); 
        return res.status(200).json({ success: true, post});

    } catch (error) {
        console.error('Error in getPost:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}


module.exports = { createPost, updatePost, getAllPosts, deletePost, getPost};