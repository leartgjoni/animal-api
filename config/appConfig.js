const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const mongoose = require('mongoose');
const apiPassport = require("./passportApi")();
const validator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const config = require('./main');
const hbsHelper = require('../helpers/hbsHelper');


module.exports = function(app) {

    // assign mongoose promise to global promise
    mongoose.Promise = global.Promise;
    mongoose.connect(config.database, { useMongoClient: true });

    // call passport web config
    require('./passport');

    // view engine setup
    app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs', helpers: hbsHelper}));
    app.set('view engine', 'hbs');

    app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));
    app.use(logger('dev'));
    // parse http post body
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    //use express validator
    app.use(validator());
    app.use(cookieParser());
    //conf session
    app.use(session({
        secret: config.jwtSecret,
        resave: false,
        saveUninitialized: false
    }));
    //use connect flash for flash messages
    app.use(flash());
    //initialize passport and passport session
    app.use(passport.initialize());
    app.use(passport.session());
    //conf static files
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(apiPassport.initialize());

    //set global variable
    app.use(function(req, res, next){
        res.locals.login = req.isAuthenticated();
        res.locals.user = req.session.passport ? req.session.passport.user : null;
        res.locals.errors = req.flash('error');
        res.locals.messages = req.flash('messages');
        next();
    });

};