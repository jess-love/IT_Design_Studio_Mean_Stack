
const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');

//specify where to find the class schedule schema
const Class_schedule = require('./models/class_schedule')

//specify where to find the reminder schema
const Reminder = require('./models/Reminder')

//specify where to find the study group schema
const StudyGroup = require('./models/study_group')

//connect and display the status 
mongoose.connect('mongodb://localhost:27017/scholarPath')
    .then(() => { console.log("connected"); })
    .catch(() => { console.log("error connecting"); });

//specify which domains can make requests and which methods are allowed
app.use((req, res, next) => {
    console.log('This line is always called');
    res.setHeader('Access-Control-Allow-Origin', '*'); //can connect from any host
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE'); //allowable methods
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
});

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//parse application/json
app.use(bodyParser.json())


// CRUD ROUTES Class schedule
app.get('/class_schedules', (req, res, next) => {
   //call mongoose method find (MongoDB db.Students.find())
    Class_schedule.find() 
        //if data is returned, send data as a response 
        .then(data => res.status(200).json(data))
        //if error, send internal server error
        .catch(err => {
        console.log('Error: ${err}');
        res.status(500).json(err);
    });

});

//find a class based on the id
app.get('/class_schedules/:id', (req, res, next) => {
    //call mongoose method findOne (MongoDB db.class_schedule.findOne())
    Class_schedule.findOne({_id: req.params.id}) 
        //if data is returned, send data as a response 
        .then(data => {
            res.status(200).json(data)
            console.log(data);
        })
        //if error, send internal server error
        .catch(err => {
        console.log('Error: ${err}');
        res.status(500).json(err);
    });
});

//serve incoming post requests to /class schedule
app.post('/class_schedules', (req, res, next) => {
    // create a new student variable and save request’s fields 
    const class_schedule = new Class_schedule({
        className:   req.body.className,
        professor:   req.body.professor,
        day:         req.body.day,
        time:        req.body.time
    });
    //send the document to the database 
    class_schedule.save()
        //in case of success
        .then(() => { console.log('Success');})
        //if error
        .catch(err => {console.log('Error:' + err);});
});

//:id is a dynamic parameter that will be extracted from the URL
app.delete("/class_schedules/:id", (req, res, next) => {
    Class_schedule.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json("Deleted!");
    });
});

//serve incoming put requests to /class_schedules 
app.put('/class_schedules/:id', (req, res, next) => { 
    console.log("id: " + req.params.id) 
    // check that the parameter id is valid 
    if (mongoose.Types.ObjectId.isValid(req.params.id)) { 
        //find a document and set new first and last names 
        Class_schedule.findOneAndUpdate( 
            {_id: req.params.id}, 
            {$set:{ 
                className:   req.body.className, 
                professor:   req.body.professor,
                day:         req.body.day,
                time:        req.body.time
            }}, 
            {new:true} 
        ) 
        .then((class_schedule) => { 
            if (class_schedule) { //what was updated 
                console.log(class_schedule); 
            } else { 
                console.log("no data exist for this id"); 
            } 
        }) 
        .catch((err) => { 
            console.log(err); 
        }); 
    } else { 
        console.log("please provide correct id"); 
    } 
});


// CRUD ROUTES Reminder
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



// CRUD ROUTES Study group
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


// CRUD ROUTES Assignment tracker

//to use this middleware in other parts of the application
module.exports=app;