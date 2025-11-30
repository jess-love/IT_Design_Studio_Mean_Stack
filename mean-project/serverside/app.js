const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Models
const Class_schedule = require('./models/class_schedule');
const Reminder = require('./models/Reminder');
const StudyGroup = require('./models/study_group');
const Assignment = require('./models/assignment');   

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://user:password@cluster0.4wsjtrm.mongodb.net/?appName=Cluster0')
    .then(() => { console.log("connected"); })
    .catch(() => { console.log("error connecting"); });


// ================================================
// CLASS SCHEDULE ROUTES
// ================================================
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
        .then((savedSchedule) => res.status(201).json(savedSchedule)) 
        .catch(err => res.status(500).json(err));
});



app.delete("/class_schedules/:id", (req, res) => {
    Class_schedule.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json("Deleted"))
        .catch(err => res.status(500).json(err));
});

app.put('/class_schedules/:id', (req, res) => {
    Class_schedule.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
    )
    .then(updated => res.status(200).json(updated))
    .catch(err => res.status(500).json(err));
});


// ================================================
// REMINDER ROUTES
// ================================================
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


// ================================================
// STUDY GROUP ROUTES
// ================================================
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


// ================================================
// ASSIGNMENT TRACKER ROUTES 
// ================================================
app.get('/assignments', async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/assignments', async (req, res) => {
    try {
        const newAssignment = new Assignment(req.body);
        await newAssignment.save();
        res.json(newAssignment);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/assignments/:id', async (req, res) => {
    try {
        const updated = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete('/assignments/:id', async (req, res) => {
    try {
        await Assignment.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = app;
