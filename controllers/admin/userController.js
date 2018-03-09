const User = require('../../models/user');

module.exports = {
    async index(req, res, next){
        const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const total = await User.find({}).count();
        User.find({})
            .skip((page-1)*pagination)
            .limit(pagination)
            .sort({ _id: -1})
            .then(users => {
                return res.render('admin/user/index', { users, page, pagination, total });
            })
            .catch(err => next(err));
    },
    destroy(req, res, next) {
        req.checkParams('id', 'User id is required').notEmpty();
        var errors = req.validationErrors();
        if(errors) {
            var messages = [];
            errors.forEach(function (error) {
                messages.push(error.msg);
            });
            req.flash('error', messages);
            res.redirect("back");
        }
        User.findById(req.params.id)
            .then(user => {
                const name = user.name;
                user.delete()
                    .then(() => {
                        req.flash('messages', ['User '+ name +' deleted successfully']);
                        res.redirect("back");
                    })
                    .catch(err => next(err) );
            })
            .catch(err => next(err));
    }
};