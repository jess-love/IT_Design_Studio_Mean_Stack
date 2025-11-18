const express = require('express');
const mongoose = require('mongoose');
const Reminder = require('./Reminder');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/remindersDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('DB connection error:', err));

// CRUD ROUTES

// CREATE
app.post('/reminders', async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    await reminder.save();
    res.status(201).send(reminder);
  } catch (err) {
    res.status(400).send(err);
  }
});

// READ
app.get('/reminders', async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.send(reminders);
  } catch (err) {
    res.status(400).send(err);
  }
});

// UPDATE
app.put('/reminders/:id', async (req, res) => {
  try {
    const updated = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.send(updated);
  } catch (err) {
    res.status(400).send(err);
  }
});

// DELETE
app.delete('/reminders/:id', async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.send({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));