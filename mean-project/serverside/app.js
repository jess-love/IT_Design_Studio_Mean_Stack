
const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
//specify where to find the schema
const Class_schedule = require('./models/class_schedule')
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

//in the app.get() method below we add a path for the students API 
//by adding /class schedules, we tell the server that this method will be called every time http://localhost:8000/class schedule is requested. 
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

//find a student based on the id
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


//serve incoming put requests to /students 
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

//to use this middleware in other parts of the application
module.exports=app;