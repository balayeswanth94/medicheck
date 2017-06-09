var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user.js');
var Shop = require('../app/models/shop.js');
var Med = require('../app/models/medicine.js');


module.exports = function(app, passport) {
    app.get('/shopkeeper-register', function(req, res) {
        res.render('skregister', { message: req.flash('loginMessage') });
    });

    app.post('/shopkeeper-register', passport.authenticate('local-shopsignup', {
        successRedirect: '/skedit',
        failureRedirect: '/shopkeeper-register',
        failureFlash: 'true'
    }));

    app.get('/shopkeeper-login', function(req, res) {
        res.render('sklogin', { message: req.flash('loginMessage') });
    });

    app.post('/shopkeeper-login', passport.authenticate('local-shoplogin', {
        successRedirect: '/shopkeeper-profile',
        failureRedirect: '/shopkeeper-login',
        failureFlash: 'true'
    }));

    app.get('/shopkeeper-profile', isLoggedIn, function(req, res) {
        res.render('skprofile', {
            user: req.user
        });
    });

    app.get('/skedit', isLoggedIn, function(req, res) {
        res.render('skedit', {
            user: req.user
        });
    });
    app.post('/skedit', isLoggedIn, function(req, res) {
        var newDetails = {
            name: req.body.name,
            address: req.body.address,
            area: req.body.area,
            website: req.body.website,
            phone1: req.body.phone1,
            phone2: req.body.phone2,
            location: req.user.details.location
        }
        Shop.update({ 'local.email': req.user.local.email }, {
                details: newDetails
            },
            function(err, numberAffected, rawResponse) {
                console.log(err);
                //console.log(numberAffected);
            });
        res.redirect('/shopkeeper-profile');
    });
    app.get('/smap', function(req, res) {
        res.render('smap');
    });
    app.post('/smap', function(req, res) {
        var newLocation = {
            lat: req.body.location.lat,
            lng: req.body.location.lng
        }
        Shop.update({ 'local.email': req.user.local.email }, { 'details.location': newLocation },
            function(err, numberAffected, rawResponse) {
                console.log(err);
                console.log(numberAffected);
            });
        res.send("success");
    });

    app.get('/stocks', isLoggedIn, function(req, res) {
        var availableAtShop = req.user.stocks || {};
        Med.find({}, function(err, data) {
            if (err) console.log('stock error' + err);
            res.render('stocks', { availableMed: availableAtShop, totalMed: data });
        });
        //console.log(availableAtShop);
    });
    app.post('/stocks', function(req, res) {
        //console.log(req.body.post_data);
        //console.log(JSON.parse(req.body.post_data));
        Shop.update({ 'local.email': req.user.local.email }, { stocks: JSON.parse(req.body.post_data) },
            function(err, numberAffected, rawResponse) {
                console.log(err);
            })
        res.redirect('/shopkeeper-profile');
    });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}