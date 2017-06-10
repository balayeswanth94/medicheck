var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user.js');
var Shop = require('../app/models/shop.js');
var mongoose = require('mongoose');
var Med = require('../app/models/medicine.js');
var Area = require('../app/models/area.js');

module.exports = function(app, passport) {
    app.get('/', function(req, res) {
        //var x = new Area();
        //var y = new Shop();
        //console.log(x._id, y._id);
        res.render('index');
    });

    app.get('/login', function(req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: 'true'
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        var areadata;
        Area.find({}, function(err, data) {
            if (err) console.log(err);
            else areadata = data;
        })
        Med.find({}, function(err, data) {
            if (err) console.log(err);
            res.render('profile', { user: req.user, serverMed: data, serverArea: areadata });
        });
    });
    app.post('/profile', isLoggedIn, function(req, res) {
        Shop.find({ $and: [{ 'details.area': req.body.area }, { 'stocks.name': req.body.medname }] }, {},
            function(err, data) {
                if (err) console.log('client search at mongo://' + err);
                console.log('search-results:' + data);
                res.send(data);
            }
        ).select('details');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/register', function(req, res) {
        res.render('register', { message: req.flash('signupMessage') });
    });


    app.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/register',
        failureFlash: 'true'
    }));

    app.get('/forgot-password', function(req, res) {
        res.render('forgot-password');
    });

    app.get('/forgot-password/email', function(req, res) {
        res.send('Will respond soon.... Page at work!!');
    });

    app.get('/search', isLoggedIn, function(req, res) {
        Med.find({}, function(err, data) {
            if (err) console.log(err);
            res.render('search', { serverMed: data });
        });
    });

    app.post('/search', function(req, res) {
        console.log(req.body);
        Shop.find({ $and: [{ 'details.area': req.body.area }, { 'stocks.name': req.body.medname }] }, {},
            function(err, data) {
                if (err) console.log('client search at mongo://' + err);
                console.log('search-results:' + data);
                res.send(data);
            }
        ).select('details');
    });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        //console.log(req.session.passport.user.usertype);
        if (req.session.passport.user.usertype == 'user')
            return next();
        else
            res.render('/', { message: req.flash('Request denied') });
    }

    res.redirect('/');
}


/*    
Aceclofenac + Paracetamol (100 mg + 325 mg) Tablets
Aceclofenac 100 mg Tablets IP
Acetaminophen + Tramadol Hydrochloride (325 mg +
37.5 mg) film coated Tablets
ASPIRIN Tablets IP 150 mg
DICLOFENAC 50 mg+ PARACETAMOL 325 mg+
CHLORZOXAZONE 500 mg Tablets
Diclofenac Gel( Diclofenec Diethylamine 1.16 % w/w)
BP	
Diclofenac Sodium + Serratiopeptidase (50mg + 10mg)
Tab	
Diclofenac Sodium (SR)  Tablets IP 100 mg
Diclofenac Sodium 25mg per ml Inj. IP
Diclofenac Sodium 50 mg Tab IP
Etoricoxilb 120mg Tab IP
Etoricoxilb 90mg Tab	IP
Ibuprofen film coated	Tablets IP 200mg
Nimesulide 100 mg Tab IP
Paracetamol + Diclofenac Sodium (325 mg + 50 mg) Tab
Paracetamol 125 mg / 5 ml Syrup IP	
Paracetamol 500mg Tab IP
Serratiopeptidase Tablets 10 mg
Tramadol Hydrochloride 50mg/ml Inj.
Tramadol Hydrochloride 50mg/ml  Inj.
Tramadol Hydrochloride 50 mg Tab
Amikacin Sulphate 50mg/ml inj. IP
Amikacin 250mg inj. IP
Amikacin 250mg/ml inj. IP


var apibase = 'https://api.drugbankplus.com/v1';
var apikey = 'e56efd5cd1c2292a8526bc496de5e735';
*/