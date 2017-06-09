var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user.js');
var Shop = require('../app/models/shop.js');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        var key = {
                usertype: user.local.usertype,
                id: user.id,
                email: user.local.email
            }
            //console.log(user);
            //console.log(key);
        done(null, key);
    });
    passport.deserializeUser(function(key, done) {
        User.findById(key.id, function(err, user) {
            if (err) done(err);
            if (user) done(null, user);
            else {
                Shop.findById(key.id, function(err, user) {
                    if (err) done(err);
                    if (user) done(null, user)
                })
            }
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        User.findOne({ 'local.email': email }, function(err, user) {
            if (err) return done(err);
            if (!user) return done(null, false, req.flash('loginMessage', 'No user found'));
            if (!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            return done(null, user);
        });
    }));
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            password: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            User.findOne({ 'local.email': email }, function(err, user) {
                if (err) return done(err);
                if (user) return done(null, false, req.flash('signupMessage', 'That email is already registerded'));
                else {
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.local.usertype = "user";
                    newUser.save(function(err) {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                }
            });
        }
    ));

    passport.use('local-shoplogin', new LocalStrategy({
            usernameField: 'email',
            password: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            Shop.findOne({ 'local.email': email }, function(err, shop) {
                if (err) return done(err);
                if (!shop) return done(null, false, req.flash('loginMessage', 'No shop-email found'));
                if (!shop.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                return done(null, shop);
            })
        }
    ));

    passport.use('local-shopsignup', new LocalStrategy({
            usernameField: 'email',
            password: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            Shop.findOne({ 'local.email': email }, function(err, shop) {
                if (err) return done(err);
                if (shop) return done(null, false, req.flash('signupMessage', 'That shop-email is already registerded'));
                else {
                    var newShop = new Shop();
                    newShop.local.email = email;
                    newShop.local.password = newShop.generateHash(password);
                    newShop.local.usertype = "shop";
                    var date = new Date();
                    newShop.details.created_at = date;
                    console.log(newShop.local.email + 'attempt to reg@' + newShop.details.created_at);
                    newShop.save(function(err) {
                        if (err) throw err;
                        return done(null, newShop);
                    });
                }
            });
        }
    ));

}