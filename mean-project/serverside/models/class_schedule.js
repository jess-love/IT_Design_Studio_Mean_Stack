const mongoose = require('mongoose');

//define a schema/ blueprint NOTE: id is not a part of the schema 

const ClassScheduleSchema = new mongoose.Schema({
    className:  { type: String, required: true},
    professor:  { type: String, required: true},
    day:        { type: String, required: false},
    time:       { type: String, required: true}
});

//use the blueprint to create the model 
//Parameters: (model_name, schema_to_use, collection_name)
//module.exports is used to allow external access to the model  
module.exports = mongoose.model('ClassSchedule', ClassScheduleSchema,'ClassSchedules');
//note capital S in the collection name