// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. חיבור ל-MongoDB
// ודא שמשתנה הסביבה MONGODB_URI מוגדר ב-Render
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2. Middleware
app.use(express.json()); // ניתוח JSON
app.use(express.urlencoded({ extended: true })); // ניתוח טפסים
// קבצים סטטיים מוגשים מתיקיית public
app.use(express.static(path.join(__dirname, 'public'))); 

// 3. ייבוא נתיבים (Routes)
try {
    // הנתיבים יחסיים למיקום server.js (שורש הפרויקט)
    const authRoutes = require('./api/routes/authRoutes');
    const userRoutes = require('./api/routes/userRoutes');
    const classRoutes = require('./api/routes/classRoutes');
    const announcementRoutes = require('./api/routes/announcementRoutes');
    // הוסף כאן routes נוספים במידת הצורך

    // 4. הגדרת נתיבי API
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/classes', classRoutes);
    app.use('/api/announcements', announcementRoutes); 
    
} catch (error) {
    // שגיאה קריטית בטעינת routes תוביל ללוג זה
    console.error("❌ CRITICAL ERROR: Failed to load routes.", error.message);
    console.error("ודא שכל קבצי ה-Routes נמצאים ב-api/routes/ ושה-require הפנימי שלהם תקין (../models/).");
}

// 5. נתיב ברירת מחדל (עבור Frontend)
// מגיש את קובץ ה-index.html עבור כל נתיב שלא נתפס על ידי ה-API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 6. הפעלת השרת
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
