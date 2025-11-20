// api/routes/announcementRoutes.js

const express = require('express');
const router = express.Router();

// 💡 התיקון: הנתיב הוא כעת 'models/'../
// הנתיב: api/routes/announcementRoutes.js -> api/models/AnnouncementModel.js
const Announcement = require('../models/AnnouncementModel');
const Class = require('../models/Class');
const { protect } = require('../middleware/auth'); 

// ==================================================================
// נתיבים (Routes)
// ==================================================================

// 1. GET /api/announcements/main - קבלת הודעות ראשיות
router.get('/main', async (req, res) => {
    try {
        const announcements = await Announcement.find({ classId: null })
            .populate('postedBy', 'name')
            .sort({ date: -1 })
            .limit(20); 
        res.json(announcements);
    } catch (err) {
        console.error("Error loading main announcements:", err);
        res.status(500).json({ message: 'שגיאה בטעינת הודעות.' });
    }
});

// 2. POST /api/announcements - פרסום הודעה חדשה
router.post('/', protect, async (req, res) => {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'אין הרשאה לפרסם הודעות.' });
    }
    const { title, content, classId } = req.body;
    try {
        if (classId && classId !== 'main') {
            const targetClass = await Class.findById(classId);
            if (!targetClass) return res.status(404).json({ message: 'הכיתה לא נמצאה.' });
        }
        const newAnnouncement = new Announcement({
            title,
            content,
            classId: (classId === 'main' || !classId) ? null : classId,
            postedBy: req.user._id
        });
        await newAnnouncement.save();
        res.status(201).json({ message: 'ההודעה פורסמה בהצלחה!', announcement: newAnnouncement });
    } catch (err) {
        console.error("Error posting announcement:", err);
        res.status(500).json({ message: 'שגיאה בפרסום ההודעה.' });
    }
});

// 3. GET /api/announcements/class/:classId - קבלת הודעות ספציפיות לכיתה
router.get('/class/:classId', protect, async (req, res) => {
    try {
        const announcements = await Announcement.find({ classId: req.params.classId })
            .populate('postedBy', 'name')
            .sort({ date: -1 });
        res.json(announcements);
    } catch (err) {
        console.error("Error loading class announcements:", err);
        res.status(500).json({ message: 'שגיאה בטעינת הודעות כיתה.' });
    }
});

module.exports = router;