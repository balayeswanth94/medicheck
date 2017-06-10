var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var fs = require('fs');
var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var morgan = require('morgan');


var configDB = require(__dirname + '/config/database.js')
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url);




require(__dirname + '/config/passport.js')(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(flash());

app.use('/assets', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');


require(__dirname + '/controllers/routes.js')(app, passport);
require(__dirname + '/controllers/shoproutes.js')(app, passport);


app.listen(port);

// AIzaSyD0iqRIcPqhI-yFQi_eNEMpwTK-_vcB57k