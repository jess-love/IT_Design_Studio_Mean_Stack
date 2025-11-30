const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// MODELS
const Class_schedule = require('./models/class_schedule');
const Reminder = require('./models/Reminder');
const StudyGroup = require('./models/study_group');
const Assignment = require('./models/assignment');

// GOOGLE CALENDAR
const calendarRoutes = require('./google/calendar.routes.js');
const calendarService = require('./google/calendar-service.js');
const tokenStore = require('./google/token-store.js');

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Google OAuth Routes
app.use('/', calendarRoutes);

// MONGO CONNECTION

mongoose
  .connect("mongodb+srv://emanie_04:ITDesignStudio@cluster0.4wsjtrm.mongodb.net/scholarPath?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("connected"))
  .catch(err => console.error("error connecting", err));



// ===================================================
// GOOGLE EVENT BUILDER
// ===================================================
function buildStudyGroupEvent(group) {

  // group.studyDate = "2025-01-14"
  // group.studyTime = "15:45"
  const [year, month, day] = group.studyDate.split('-').map(Number);
  const [hour, minute] = group.studyTime.split(':').map(Number);

  // Construct correct JS date in EST
  const start = new Date(year, month - 1, day, hour, minute, 0);
  const end = new Date(start);
  end.setHours(end.getHours() + 1);

  return {
    summary: group.groupName,
    description: `Course: ${group.course}\nUser ID: ${group.userId}`,
    location: group.location,
    start: {
      dateTime: start.toISOString(),
      timeZone: "America/New_York"
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: "America/New_York"
    }
  };
}


// ===================================================
// CLASS SCHEDULE ROUTES
// ===================================================
app.get('/class_schedules', (req, res) => {
  Class_schedule.find()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json(err));
});

app.get('/class_schedules/:id', (req, res) => {
  Class_schedule.findOne({ _id: req.params.id })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json(err));
});

app.post('/class_schedules', (req, res) => {
  const class_schedule = new Class_schedule(req.body);
  class_schedule.save()
    .then(saved => res.status(201).json(saved))
    .catch(err => res.status(500).json(err));
});

app.put('/class_schedules/:id', (req, res) => {
  Class_schedule.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then(updated => res.status(200).json(updated))
    .catch(err => res.status(500).json(err));
});

app.delete('/class_schedules/:id', (req, res) => {
  Class_schedule.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json("Deleted"))
    .catch(err => res.status(500).json(err));
});


// ===================================================
// REMINDER ROUTES
// ===================================================
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


// ===================================================
// STUDY GROUP ROUTES + GOOGLE CALENDAR
// ===================================================
app.post('/studygroups', async (req, res) => {
  try {
    const group = new StudyGroup(req.body);
    await group.save();

    const token = tokenStore.getToken();
    if (token) {
      const eventDetails = buildStudyGroupEvent(group);
      const eventId = await calendarService.createEvent(token, eventDetails);
      group.googleEventId = eventId;
      await group.save();
    }

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
    if (!group) return res.status(404).send({ message: "Not found" });
    res.send(group);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put('/studygroups/:id', async (req, res) => {
  try {
    const group = await StudyGroup.findByIdAndUpdate(req.params.id, req.body, { new: true });

    const token = tokenStore.getToken();
    if (token && group.googleEventId) {
      const eventDetails = buildStudyGroupEvent(group);
      await calendarService.updateEvent(token, group.googleEventId, eventDetails);
    }

    res.send(group);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/studygroups/:id', async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    const token = tokenStore.getToken();
    if (token && group && group.googleEventId) {
      await calendarService.deleteEvent(token, group.googleEventId);
    }

    await StudyGroup.findByIdAndDelete(req.params.id);
    res.send({ message: "Study group deleted" });
  } catch (err) {
    res.status(400).send(err);
  }
});


// ===================================================
// ASSIGNMENTS
// ===================================================
app.get('/assignments', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/assignments', async (req, res) => {
  try {
    const newAssignment = new Assignment(req.body);
    await newAssignment.save();
    res.json(newAssignment);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put('/assignments/:id', async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete('/assignments/:id', async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).send(err);
  }
});


// START SERVER
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;