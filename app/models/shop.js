var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var shopSchema = mongoose.Schema({
    local            : {
        email        : {type:String, required:true, unique:true},
        password     : {type:String, required:true},
        usertype     : String
    },
    details          :{
        name         : String,
        address      : String,
        area         : String,
        website      : String,
        phone1       : String,
        phone2       : String,
        hitcount     : Number, 
        created_at   : Date,
        updated_at   : Date,
        location     : {
            lat      : Number,
            lng      : Number
        },
        area         : String

    },
    stocks           :[{
        name         : {type:String, required:true, unique:true},
        hits         : Number
    }],   
});

shopSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
shopSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('Shop', shopSchema);