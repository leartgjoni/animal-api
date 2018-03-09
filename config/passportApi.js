const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("../models/user");
const config = require("./main.js");
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function() {
    const strategy = new Strategy(params, function(payload, done) {
        User.findById(payload.id)
            .then(user => {
                if(!user) {
                    return done(new Error("User not found"), null);
                }

                return done(null, {
                    id: user.id
                });

            })
            .catch(err => {
                return done(new Error("Query error"), null);
            });
    });
    passport.use(strategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", config.jwtSession);
        }
    };
};