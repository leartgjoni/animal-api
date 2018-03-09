const express = require('express');
const router = express.Router();
const passport = require('passport');
const csrf = require('csurf');
const authController = require('../../controllers/admin/authController');
const authMiddlewares = require('../../middlewares/authMiddlewares');

const csrfProtection = csrf();

router.get('/login', [authMiddlewares.notLoggedIn, csrfProtection], authController.getLogin);

router.post('/login', passport.authenticate('local.signin', {
    failureRedirect: '/auth/login',
    failureFlash: true
}), authController.login);

router.get('/logout', authMiddlewares.isLoggedIn, authController.logout);

module.exports = router;
