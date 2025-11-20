const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: String,
    description: String,
    dueDate: String,
    subject: String,
    priority: String,
    status: String
});

module.exports = mongoose.model('Assignment', assignmentSchema, 'assignments');
