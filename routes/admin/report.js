const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/admin/reportController');
const authMiddlewares = require('../../middlewares/authMiddlewares');

router.use(authMiddlewares.isLoggedIn);

router.get('/', reportController.index);
router.get('/delete/:id', reportController.destroy);
router.get('/deleteRescue/:id', reportController.destroyRescue);

module.exports = router;