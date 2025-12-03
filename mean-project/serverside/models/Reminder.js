const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },      // YYYY-MM-DD
  time: { type: String, required: true },      // HH:mm (24hr)
  description: { type: String },               
  type: { type: String, required: true },
  googleEventId: { type: String, default: null }
});

module.exports = mongoose.model('Reminder', reminderSchema);