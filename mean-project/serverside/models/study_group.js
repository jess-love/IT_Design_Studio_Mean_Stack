const mongoose = require('mongoose');

const StudyGroupSchema = new mongoose.Schema({
    groupName: { type: String, required: true },
    course: { type: String, required: true },
    location: { type: String, required: true },

    studyDate: { type: String, required: true },  
    studyTime: { type: String, required: true },  

    userId: { type: String, required: true },
    googleEventId: { type: String }
});

module.exports = mongoose.model('StudyGroup', StudyGroupSchema);