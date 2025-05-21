const express = require('express');
const { body } = require('express-validator');
const { createPost, updatePost, getAllPosts, deletePost, getPost } = require('../controllers/post.controllers');
const userAuthenticationMiddleware = require('../middlewares/user.middlewares');
const router = express.Router();


const createValidation =  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('tags').isArray().withMessage('Tags must be an array'),
  ];

const updateValidation = [
    body('title')
        .optional()
        .isString()
        .trim()
        .notEmpty().withMessage('Title must not be empty'),
    
    body('content')
        .optional()
        .isString()
        .trim()
        .notEmpty().withMessage('Content must not be empty'),

    body('category')
        .optional()
        .isString()
        .trim()
        .notEmpty().withMessage('Category must not be empty'),

    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array of strings'),
];



router.post('/create', userAuthenticationMiddleware, createValidation, createPost);
router.put('/update/:id', userAuthenticationMiddleware, updateValidation, updatePost);
router.delete('/delete/:id', userAuthenticationMiddleware, deletePost);

router.get('/get-post/:id', getPost);
router.get('/get-all-posts', getAllPosts);

module.exports = router;


