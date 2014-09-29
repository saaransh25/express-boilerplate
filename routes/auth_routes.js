var express = require('express');
var router = express.Router();
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User.js');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getAuthenticated(username, password, function (err, user, failureReason) {
      if (err || failureReason) return done(null, false);
      return done(null, username);
    });
  })
);

//This serializes the users into sessions
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});

/* GET home page. */
router.get('/login', function(req, res) {
  res.render('./auth/login',{error: req.flash('error')[0]});
});

router.post('/login',
  passport.authenticate(
    'local',
    {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }
  )
);

/* GET home page. */
router.get('/signup', function(req, res) {
  res.render('./auth/signup',{user: undefined, error: req.flash('error')[0]});
});

router.post('/signup', function(req, res) {
  var user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

  if (req.body.password!==req.body.confirm) return res.render('./auth/signup',{user: user, error: {confirm: {
      message: 'Password and confirm password do not match'
    }}
  });

  user.save(function(err) {
    if (err) {
      return res.render('./auth/signup',{user: user, error: err.errors});
    }
    req.login(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  });
});

router.get('/logout', function (req, res) {
   req.logout();
   res.redirect('/login');  
});

router.get('/forgot', function (req, res) {


});

router.post('/forgot', function (req, res) {

});

router.get('/reset', function (req, res) {

});

router.post('/reset', function (req, res) {

});

router.get('/activate', function (req, res) {

});
module.exports = router;