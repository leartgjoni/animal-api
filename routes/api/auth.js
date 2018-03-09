const express = require('express');
const multer = require('multer');
const upload = multer({dest:'./public/images/user_profile_images'});
const router = express.Router();
const authController = require('../../controllers/api/AuthController');
const apiAuth = require('../../config/passportApi');

router.post('/login', authController.login);
router.post('/register', upload.single('image'), authController.register);
router.post('/fbAuth', authController.fbAuth);

module.exports = router;
