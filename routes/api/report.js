const express = require('express');
const multer = require('multer');
const upload = multer({dest:'./public/images/reports'});
const router = express.Router();
const reportController = require('../../controllers/api/ReportController');
const apiAuth = require('../../config/passportApi');

router.get('/', reportController.index);
router.get('/rescued', reportController.indexRescued);
router.get('/:id', reportController.show);
router.post('/', [ apiAuth().authenticate(), upload.single('image') ] , reportController.store);
router.delete('/:id', apiAuth().authenticate(), reportController.destroy);

module.exports = router;
