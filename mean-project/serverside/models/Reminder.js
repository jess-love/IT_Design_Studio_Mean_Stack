const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  note: { type: String },
  type: { type: String, required: true }   
});

module.exports = mongoose.model('Reminder', reminderSchema);
