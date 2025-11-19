const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String
});

module.exports = mongoose.model('Reminder', reminderSchema);