// api/routes/classRoutes.js

const express = require('express');
const router = express.Router();
const Class = require('../models/Class'); // נתיב מתוקן
const User = require('../models/User'); // נתיב מתוקן
const { protect, adminOrTeacher } = require('../middleware/auth'); // נתיב למידלוור

// GET /api/classes
// קבלת כל הכיתות (רק מורה/מנהל יכול)
router.get('/', protect, adminOrTeacher(['admin', 'teacher']), async (req, res) => {
    try {
        const classes = await Class.find({}).populate('students', 'name email');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בטעינת הכיתות.' });
    }
});

// POST /api/classes
// יצירת כיתה חדשה (רק מורה/מנהל יכול)
router.post('/', protect, adminOrTeacher(['admin', 'teacher']), async (req, res) => {
    const { name } = req.body;
    try {
        const classExists = await Class.findOne({ name });
        if (classExists) {
            return res.status(400).json({ message: 'כיתה בשם זה כבר קיימת.' });
        }
        const newClass = await Class.create({ name });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה ביצירת הכיתה.' });
    }
});

// PUT /api/classes/:classId/enroll/:studentId
// רישום תלמיד לכיתה
router.put('/:classId/enroll/:studentId', protect, adminOrTeacher(['admin', 'teacher']), async (req, res) => {
    const { classId, studentId } = req.params;
    try {
        const targetClass = await Class.findById(classId);
        const student = await User.findById(studentId);

        if (!targetClass) {
            return res.status(404).json({ message: 'הכיתה לא נמצאה.' });
        }
        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'התלמיד לא נמצא או אינו תלמיד.' });
        }

        // ודא שהתלמיד עדיין לא רשום
        if (targetClass.students.includes(studentId)) {
            return res.status(400).json({ message: 'התלמיד כבר רשום לכיתה זו.' });
        }

        targetClass.students.push(studentId);
        await targetClass.save();

        res.json({ message: 'התלמיד נרשם בהצלחה.', class: targetClass });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה ברישום התלמיד.' });
    }
});

module.exports = router;