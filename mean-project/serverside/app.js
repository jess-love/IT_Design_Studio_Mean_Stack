const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/IT6203', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Load Routes
const assignmentRoutes = require('./models/assignments-routes');
app.use('/assignments', assignmentRoutes);

// Default route (optional)
app.get('/', (req, res) => {
    res.send("Backend is running");
});

    //GOOGLE EVENT BUILDER FOR Assignment Tracker
function buildassignmenttrackerGroupEvent(cls) {

}

    app.get('/assignmenttracker', (req, res) =>{
        
    });

     app.get('/assignmenttracker/:id', (req, res) =>{
        
    });

     app.post('/assignmenttracker/:id', async (req, res) =>{
        
    });

     app.put('/assignmenttracker/:id', async (req, res) =>{
        
    });
     app.delete('/assignmenttracker/:id', async (req, res) =>{
        
    });

module.exports = app;
