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



// MongoDB Connection
mongoose.connect('mongodb+srv://linda_1:ITDesignStudio@cluster0.4wsjtrm.mongodb.net/scholarPath?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("connected"))
  .catch(err => console.log("error connecting:", err));

// Google OAuth Routes
app.use('/', calendarRoutes);




// ===================================================
// GOOGLE EVENT BUILDER FOR STUDY GROUP
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
// GOOGLE EVENT BUILDER FOR CLASS SCHEDULE
// ===================================================
function buildClassScheduleGroupEvent(cls) {
  const daysOfWeek = {
    "Sunday": "SU",
    "Monday": "MO",
    "Tuesday": "TU",
    "Wednesday": "WE",
    "Thursday": "TH",
    "Friday": "FR",
    "Saturday": "SA"
  };

  const [hour, minute] = cls.time.split(':').map(Number);

  const start = new Date();
  const targetDay = daysOfWeek[cls.day];
  const today = start.getDay();
  const targetDayNum = Object.keys(daysOfWeek).indexOf(cls.day);

  let diff = targetDayNum - today;
  if (diff < 0) diff += 7;
  start.setDate(start.getDate() + diff);
  start.setHours(hour, minute, 0, 0);

  const end = new Date(start);
  end.setHours(end.getHours() + 1); //   1 hour by default

  return {
    summary: cls.className,
    description: `Professor: ${cls.professor}`,
    start: {
      dateTime: start.toISOString(),
      timeZone: "America/New_York"
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: "America/New_York"
    },
    recurrence: [`RRULE:FREQ=WEEKLY;BYDAY=${targetDay}`] // repeats the class schedule every week
  };
}



// ===================================================
// CLASS SCHEDULE ROUTES + GOOGLE CALENDAR
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

app.post('/class_schedules', async (req, res) => {
  try {
    console.log("Incoming class schedule:", req.body);

    const { className, professor, day, time } = req.body;

    if (!className || !time || !day) {
      return res.status(400).json({ message: "Missing required field: className, day, or time" });
    }

    if (!/^\d{1,2}:\d{2}$/.test(time)) {
      return res.status(400).json({ message: "Time must be in HH:mm format" });
    }

    const cls = new Class_schedule({ className, professor, day, time });
    await cls.save(); 

   
    const token = tokenStore.getToken();
    if (token) {
      try {
        const eventDetails = buildClassScheduleGroupEvent(cls);
        const eventId = await calendarService.createEvent(token, eventDetails);
        cls.googleEventId = eventId;
        await cls.save();
      } catch (gcalErr) {
        console.error("Google Calendar error:", gcalErr);
        
        return res.status(500).json({ message: "Saved in DB but failed to create Google Calendar event", error: gcalErr });
      }
    }

    res.status(201).json(cls);

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error while saving class schedule", error: err });
  }
});


app.put('/class_schedules/:id', async (req, res) => {
  try {
    const { className, professor, day, time } = req.body;

    if (!className || !time || !day) {
      return res.status(400).json({ message: "Missing required field: className, day, or time" });
    }

    if (!/^\d{1,2}:\d{2}$/.test(time)) {
      return res.status(400).json({ message: "Time must be in HH:mm format" });
    }

    const cls = await Class_schedule.findByIdAndUpdate(
      req.params.id,
      { className, professor, day, time },
      { new: true }
    );

    if (!cls) return res.status(404).json({ message: "Class schedule not found" });

    const token = tokenStore.getToken();
    if (token && cls.googleEventId) {
      try {
        const eventDetails = buildClassScheduleGroupEvent(cls);
        await calendarService.updateEvent(token, cls.googleEventId, eventDetails);
      } catch (gcalErr) {
        console.error("Google Calendar update error:", gcalErr);
        return res.status(500).json({ message: "Updated in DB but failed to update Google Calendar event", error: gcalErr });
      }
    }

    res.status(200).json(cls);

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error while updating class schedule", error: err });
  }
});

app.delete('/class_schedules/:id', async (req, res) => {
  try {
    const cls = await Class_schedule.findById(req.params.id);

    if (!cls) return res.status(404).json({ message: "Class schedule not found" });

    const token = tokenStore.getToken();
    if (token && cls.googleEventId) {
      try {
        await calendarService.deleteEvent(token, cls.googleEventId);
      } catch (gcalErr) {
        console.error("Google Calendar delete error:", gcalErr);
        return res.status(500).json({ message: "Deleted in DB but failed to delete Google Calendar event", error: gcalErr });
      }
    }

    await Class_schedule.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Class schedule deleted successfully" });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error while deleting class schedule", error: err });
  }
});

// ===================================================
// GOOGLE EVENT BUILDER FOR REMINDER
// ===================================================
function buildReminderEvent(reminder) {

  const [year, month, day] = reminder.date.split('-').map(Number);
  const [hour, minute] = reminder.time.split(':').map(Number);

  const start = new Date(year, month - 1, day, hour, minute, 0);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 30); // 30-min duration

  return {
    summary: reminder.title,
    description: reminder.description || "Scholar Path Reminder",
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
// REMINDER ROUTES + GOOGLE CALENDAR
// ===================================================

// CREATE REMINDER + GOOGLE CALENDAR
app.post('/reminders', async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    await reminder.save();

    const token = tokenStore.getToken();
    if (token) {
      try {
        const eventDetails = buildReminderEvent(reminder);
        const eventId = await calendarService.createEvent(token, eventDetails);
        reminder.googleEventId = eventId;
        await reminder.save();
      } catch (err) {
        console.error("Google Calendar Create Error:", err);
      }
    }

    res.status(201).json(reminder);
  } catch (err) {
    res.status(400).json(err);
  }
});

// GET ALL REMINDERS
app.get('/reminders', async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.json(reminders);
  } catch (err) {
    res.status(400).json(err);
  }
});

// UPDATE REMINDER + GOOGLE CALENDAR
app.put('/reminders/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    const token = tokenStore.getToken();
    if (token && reminder.googleEventId) {
      try {
        const eventDetails = buildReminderEvent(reminder);
        await calendarService.updateEvent(token, reminder.googleEventId, eventDetails);
      } catch (err) {
        console.error("Google Calendar Update Error:", err);
      }
    }

    res.json(reminder);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE REMINDER + GOOGLE CALENDAR
app.delete('/reminders/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    const token = tokenStore.getToken();
    if (token && reminder && reminder.googleEventId) {
      try {
        await calendarService.deleteEvent(token, reminder.googleEventId);
      } catch (err) {
        console.error("Google Calendar Delete Error:", err);
      }
    }

    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: "Reminder deleted" });

  } catch (err) {
    res.status(400).json(err);
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

module.exports = app;

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});