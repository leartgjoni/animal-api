var passport = require('passport');
var Admin = require('../models/admin');
var LocalStrategy = require('passport-local').Strategy;

// tell passport how to store user in session
passport.serializeUser(function(user, done){
    done(null, user.id); //serialize user by id
});

// tell passport how to take the user from the session
passport.deserializeUser(function(id, done){
    Admin.findById(id, function(err, user){
        done(err, user);
    })
});

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    papsswordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    //validator
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    Admin.findOne({ email: email }, function(err, user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message: 'No user found.'});
        }
        if(!user.validPassword(password)){
            return done(null, false, {message: 'Wrong password.'});
        }

        req.flash('messages', ['Admin logged in successfully']);
        return done(null, user);

    });
}));
