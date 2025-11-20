// api/models/AnnouncementModel.js

const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true
    },
    content: { 
        type: String, 
        required: true,
        trim: true
    },
    classId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Class', // חייב להתאים לשם המודל ב-Class.js
        default: null 
    }, 
    postedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // חייב להתאים לשם המודל ב-User.js
        required: true
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Announcement', announcementSchema);