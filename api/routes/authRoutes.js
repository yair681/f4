// api/routes/authRoutes.js

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // נתיב מתוקן
const { protect } = require('../middleware/auth'); // נתיב למידלוור

const router = express.Router();

// פונקציה ליצירת טוקן
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// POST /api/auth/login
// התחברות למערכת
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'אימייל או סיסמה שגויים.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'שגיאת שרת פנימית.' });
    }
});

// GET /api/auth/profile
// קבלת פרטי משתמש מחובר
router.get('/profile', protect, async (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
    });
});

module.exports = router;