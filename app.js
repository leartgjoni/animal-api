const express = require('express');
const appConfig = require('./config/appConfig');
const appErrorHandler = require('./config/appErrorHandler');
//routes import
const index = require('./routes/admin/index');
const auth = require('./routes/admin/auth');
const user = require('./routes/admin/user');
const report = require('./routes/admin/report');
const apiAuth = require('./routes/api/auth');
const apiReport = require('./routes/api/report');
const apiRescue = require('./routes/api/rescue');
const apiProfile = require('./routes/api/profile');

const app = express();

appConfig(app);

//routes setup
app.use('/', index);
app.use('/auth',auth);
app.use('/user', user);
app.use('/report', report);
//api routes setup
app.use('/api/auth', apiAuth);
app.use('/api/report', apiReport);
app.use('/api/rescue', apiRescue);
app.use('/api/profile', apiProfile);

appErrorHandler(app);

module.exports = app;