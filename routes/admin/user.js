const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const authMiddlewares = require('../../middlewares/authMiddlewares');

router.use(authMiddlewares.isLoggedIn);

router.get('/', userController.index);
router.get('/delete/:id', userController.destroy);

module.exports = router;