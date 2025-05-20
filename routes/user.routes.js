const express = require('express');
const { userRegister, userLogin } = require('../controllers/user.controllers');
const { body } = require('express-validator');
const router = express.Router();

const validation = [
    body('first_name')
        .notEmpty().withMessage('First name is required')
        .isAlpha().withMessage('First name must contain only letters'),

    body('last_name')
        .notEmpty().withMessage('Last name is required')
        .isAlpha().withMessage('Last name must contain only letters'),

    body('email_id')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

router.post('/register', validation, userRegister);
router.get('/login', validation.slice(2, 4), userLogin);

module.exports = router;