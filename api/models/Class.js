// api/models/Class.js

const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // הפנייה למשתמשים (תלמידים)
    students: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // חובה להתאים לשם המודל ב-User.js
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Class = mongoose.model('Class', classSchema);
module.exports = Class;