const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// MODELS
const Reminder = require('./Reminder');
const StudyGroup = require('./study_group');

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/remindersDB')
  .then(async () => {
    console.log('MongoDB connected');
    await seedStudyGroups();
  })
  .catch(err => console.log('DB connection error:', err));



async function seedStudyGroups() {
  try {
    const count = await StudyGroup.countDocuments();

    if (count === 0) {
      await StudyGroup.insertMany([
        {
          groupName: 'Math Masters',
          course: 'Calculus I',
          location: 'Library Room 2',
          studyDay: 'Monday',
          userId: 'U101'
        },
        {
          groupName: 'Code Crew',
          course: 'Intro to Programming',
          location: 'Online (Zoom)',
          studyDay: 'Wednesday',
          userId: 'U202'
        },
        {
          groupName: 'Bio Buddies',
          course: 'Biology 101',
          location: 'Science Building 5',
          studyDay: 'Friday',
          userId: 'U303'
        }
      ]);

      console.log('Inserted default study groups.');
    }
  } catch (err) {
    console.log('Error seeding study groups:', err);
  }
}


// =================== REMINDER CRUD ===================

b55ba4af4e50bb5e06b687796942efa571c6f0de
app.post('/reminders', async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    await reminder.save();
    res.status(201).send(reminder);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/reminders', async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.send(reminders);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put('/reminders/:id', async (req, res) => {
  try {
    const updated = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updated);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/reminders/:id', async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.send({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(400).send(err);
  }
});


// =================== STUDY GROUP CRUD ===================
app.post('/studygroups', async (req, res) => {
  try {
    const group = new StudyGroup(req.body);
    await group.save();
    res.status(201).send(group);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/studygroups', async (req, res) => {
  try {
    const groups = await StudyGroup.find();
    res.send(groups);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/studygroups/:id', async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).send({ message: 'Not found' });
    res.send(group);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put('/studygroups/:id', async (req, res) => {
  try {
    const updated = await StudyGroup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updated);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/studygroups/:id', async (req, res) => {
  try {
    await StudyGroup.findByIdAndDelete(req.params.id);
    res.send({ message: 'Study group deleted' });
  } catch (err) {
    res.status(400).send(err);
  }
});


app.listen(8000, () => console.log('Server running on port 8000'));