const Admin = require('../models/admin');
const config = require('../config/main');

const mongoose = require('mongoose');
//assign mongoose promise to global promise
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useMongoClient: true });

const admin = new Admin();
admin.name = "admin";
admin.email = "admin@admin.com";
admin.password = admin.encryptPassword("password");

admin.save()
    .then(result => {
        console.log("seeded!");
        mongoose.disconnect();
    })
    .catch(e => {
        console.log(e);
        mongoose.disconnect();
    });