module.exports = {
    getLogin(req, res, next){
        res.render('admin/auth/login', {csrfToken: req.csrfToken()})
    },
    login(req, res, next){
        if(req.session.oldUrl) {
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect(oldUrl);
        } else {
            res.redirect('/');
        }
    },
    logout(req, res, next){
        req.logout();
        res.redirect('/');
    }
};