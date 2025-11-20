// server.js (לצורך בדיקה בלבד!)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. חיבור ל-MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2. Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

// 3. ייבוא נתיבים (Routes) - כל הקטע הזה מבוטל זמנית!
/* try {
    const authRoutes = require('./api/routes/authRoutes');
    const userRoutes = require('./api/routes/userRoutes');
    const classRoutes = require('./api/routes/classRoutes');
    const announcementRoutes = require('./api/routes/announcementRoutes');
    
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/classes', classRoutes);
    app.use('/api/announcements', announcementRoutes); 
    
} catch (error) {
    console.error("❌ CRITICAL ERROR: Failed to load routes.", error.message);
}
*/

// 5. נתיב ברירת מחדל (עבור Frontend)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 6. הפעלת השרת
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}. Routes are currently disabled for testing.`);
});
