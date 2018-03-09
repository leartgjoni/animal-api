const FB = require('fb');
const User = require("../../models/user");
const config = require("../../config/main");
const jwt = require("jwt-simple");
const lang = require("../../config/lang/auth");

module.exports = {
    login(req, res, next) {

            req.checkBody('email', lang.invalid_email).notEmpty().isEmail();
            req.checkBody('password', lang.invalid_password).notEmpty();

            const errors = req.validationErrors();
            if(errors) {
                return res.status(400).send({errors});
            }

            const email = req.body.email;
            const password = req.body.password;

            User.findOne({email: email}, function (err, user) {
                if (err) {
                    return res.status(500).send({error: lang.error});
                }
                if (!user) {
                    return res.status(401).send({error: lang.wrong_credentials});
                }
                if (!user.validPassword(password)) {
                    return res.status(401).send({error: lang.wrong_credentials});
                }

                const payload = {
                    id: user.id
                };
                const token = jwt.encode(payload, config.jwtSecret);
                return res.send({ _id: user._id, token });

            });
    },
    register(req, res, next) {

        req.checkBody('email', lang.invalid_email).notEmpty().isEmail();
        req.checkBody('password', lang.invalid_password).notEmpty().isLength({min: 4});
        req.checkBody('name', lang.name_required).notEmpty();

        const errors = req.validationErrors();
        if(errors) {
            return res.status(400).send({errors});
        }

        User.findOne({email: req.body.email})
            .then(user => {
                if(user) {
                    return res.status(401).send({ error: lang.email_already_used});
                }

                var user = new User();
                user.email = req.body.email;
                user.password = user.encryptPassword(req.body.password);
                user.name = req.body.name;
                if(req.file)
                    user.image = req.file.filename;

                user.save()
                    .then(user => {
                        const payload = {
                            id: user.id
                        };
                        const token = jwt.encode(payload, config.jwtSecret);
                        return res.send({ _id: user._id, token });
                    })
                    .catch(error => { return res.status(500).send({error: lang.error})});
            })
            .catch(error => { return res.status(500).send({error: lang.error}) });

    },
    async fbAuth(req, res, next){

        req.checkBody('token', lang.token_required).notEmpty();
        const errors = req.validationErrors();
        if(errors) {
            return res.status(400).send({error: lang.error});
        }

        FB.setAccessToken(req.body.token);

        FB.api('/me', {fields: 'id,name,email'}, (response) => {

            if(response.error)
                return res.status(500).send({error: lang.error });
            let username = null;
            if(response.email)
                username = response.email;
            else
                username = `${response.id}@facebook.com`;

            User.findOne({ email: username })
                .then(user => {
                    if(user){
                        const payload = {
                            id: user.id
                        };
                        const token = jwt.encode(payload, config.jwtSecret);
                        return res.send({ token });
                    }
                    let newUser = new User();
                    newUser.name = response.name;
                    newUser.email = username;
                    newUser.save()
                        .then(newUser => {
                            const payload = {
                                id: newUser.id
                            };
                            const token = jwt.encode(payload, config.jwtSecret);
                            return res.send({ _id: newUser._id, token });
                        })
                        .catch(error => {return res.status(500).send({error: lang.register_error })});

                })
                .catch(error => {return res.status(500).send({error: lang.error })});
        });

    }
};