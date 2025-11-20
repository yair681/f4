// api/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // נתיב מתוקן ל-api/models

// פונקציית הגנה על נתיבים
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // קבלת הטוקן מה-Header
            token = req.headers.authorization.split(' ')[1];

            // אימות הטוקן
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // מציאת המשתמש לפי ה-ID בטוקן
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'משתמש לא נמצא. אין אישור גישה.' });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'טוקן לא תקין או פג תוקף.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'לא נמצא טוקן. אין אישור גישה.' });
    }
};

// פונקציית בדיקת מנהל/מורה
const adminOrTeacher = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'אין לך הרשאה לבצע פעולה זו.' });
    }
    next();
};

module.exports = { protect, adminOrTeacher };