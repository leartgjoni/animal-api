const express = require('express');
const multer = require('multer');
const upload = multer({dest:'./public/images/rescues'});
const router = express.Router();
const rescueController = require('../../controllers/api/RescueController');
const apiAuth = require('../../config/passportApi');

router.post('/:id', [ apiAuth().authenticate(), upload.single('image') ] , rescueController.store);
router.delete('/:id', apiAuth().authenticate(), rescueController.destroy);

module.exports = router;
