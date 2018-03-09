const express = require('express');
const authMiddlewares = require('../../middlewares/authMiddlewares');
const router = express.Router();

/* GET home page. */
router.get('/', authMiddlewares.isLoggedIn,function(req, res, next) {
  res.render('index');
});

module.exports = router;
