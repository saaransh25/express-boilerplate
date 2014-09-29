var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (!req.user) return res.redirect('/login');
  res.render('./home/index', { title: 'Express' });
});

module.exports = router;