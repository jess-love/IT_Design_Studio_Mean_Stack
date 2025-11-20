const mongoose = require('mongoose');

//define a schema/ blueprint NOTE: id is not a part of the schema 

const ClassScheduleSchema = new mongoose.Schema({
    className:  { type: String, required: true},
    professor:  { type: String, required: true},
    day:        { type: String, required: false},
    time:       { type: String, required: true}
});


module.exports = mongoose.model('ClassSchedule', ClassScheduleSchema,'ClassSchedules');
