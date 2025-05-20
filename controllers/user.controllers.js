const { validationResult, Result } = require("express-validator");
const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'yereyerepausatuladetopaisa';

async function userRegister(req, res) {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ success: false, errors: validationErrors.array() });
    }

    const { first_name, last_name, email_id, password } = req.body;

    try {
        const existingUser = await User.findOne({ email_id });
        if (existingUser) {
            return res.status(400).json({ success: false, errors: [{ msg: 'User Already exists' }] })
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            const newUser = await User.create({
                first_name,
                last_name,
                email_id,
                password: hash,
            });
        });

        return res.status(201).json({ success: true, message: 'User registered successfully' });

    } catch (error) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

async function userLogin(req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ success: false, errors: validationErrors.array() });
    }

    const { email_id, password } = req.body;

    try {
  
        const user = await User.findOne({ email_id });
        if (!user) {
            return res.status(401).json({ success: false, error: 'Authentication Failed!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Authentication Failed!' });
        }

        const payload = { email_id, id: user._id };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('JWT Sign Error:', err);
                return res.status(500).json({ success: false, error: 'Token generation failed' });
            }

            const { password, ...userWithoutPassword } = user._doc;
            return res.status(200).json({ success: true, token, user: userWithoutPassword });
        });

    } catch (error) {
        console.error('Server Error:', error.message);
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
}

module.exports = {
    userRegister,
    userLogin
}