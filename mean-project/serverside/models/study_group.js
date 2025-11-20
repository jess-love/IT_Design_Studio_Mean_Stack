const mongoose = require('mongoose');

const StudyGroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  course: { type: String, required: true },
  location: { type: String, required: true },
  studyDay: { type: String, required: true },
  userId: { type: String, required: true }
});

module.exports = mongoose.model('StudyGroup', StudyGroupSchema);