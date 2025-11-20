// api/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // 💡 הנתיב תוקן
const { protect, adminOrTeacher } = require('../middleware/auth'); 

// ==================================================================
// נתיבים (Routes) - (הקוד הפנימי נשאר זהה)
// ==================================================================

// POST /api/users - יצירת משתמש חדש (רק מנהל יכול)
router.post('/', protect, adminOrTeacher(['admin']), async (req, res) => {
    const { name, email, password, role } = req.body;
    // ... לוגיקה ...
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'משתמש עם אימייל זה כבר קיים.' });
        }
        const user = await User.create({ name, email, password, role });
        if (user) {
            res.status(201).json({
                _id: user._id, name: user.name, email: user.email, role: user.role, message: 'המשתמש נוצר בהצלחה.'
            });
        } else {
            res.status(400).json({ message: 'נתוני משתמש לא תקינים.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'שגיאת שרת פנימית.' });
    }
});

// GET /api/users/students - קבלת רשימת תלמידים
router.get('/students', protect, adminOrTeacher(['admin', 'teacher']), async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('name email');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בטעינת התלמידים.' });
    }
});

// GET /api/users - קבלת כל המשתמשים
router.get('/', protect, adminOrTeacher(['admin']), async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בטעינת המשתמשים.' });
    }
});

module.exports = router;
