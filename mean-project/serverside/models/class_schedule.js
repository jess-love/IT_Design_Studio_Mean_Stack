const mongoose = require('mongoose');

//define a schema/ blueprint NOTE: id is not a part of the schema 

const ClassScheduleSchema = new mongoose.Schema({
    className:  { type: String, required: true},
    professor:  { type: String, required: false},
    day:        { type: String, required: true},
    time:       { type: String, required: true},
    googleEventId: { type: String, default: null }

});


module.exports = mongoose.model('ClassSchedule', ClassScheduleSchema,'ClassSchedules');
