const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest:'./public/images/user_profile_images'});
const apiAuth = require('../../config/passportApi');
const profileController = require('../../controllers/api/ProfileController');

router.get('/myprofile', apiAuth().authenticate(), profileController.myProfile);
router.get('/settings', apiAuth().authenticate(), profileController.settings);
router.get('/:id', profileController.show);
router.patch('/', [ apiAuth().authenticate(), upload.single('image') ], profileController.update);

module.exports = router;
