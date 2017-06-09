var mongoose = require('mongoose');

// define the schema for our user model
var medSchema = mongoose.Schema({
    _id: Number,
    name : String

});

// create the model for users and expose it to our app
module.exports = mongoose.model('medicines', medSchema);