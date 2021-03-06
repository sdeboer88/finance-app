var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Auth = require('../middleware/requireLogin');

/* GET home page. */
router.get('/',function(req, res, next) {
    console.log(req.session.userId);
    res.render('index', { title: 'Finance App' });
});

router.get('/about',function(req, res, next) {
  console.log(req.session.userId);
  res.render('about', { title: 'About' });
});

router.post("/sign-in/process", function(req, res, next) {
  if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId=user._id;
        return res.redirect('/users/welcome');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});

///////////////
// REGISTRATION
///////////////

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.post("/register/submit", function(req, res, next) {
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
      req.body.username &&
      req.body.password &&
      req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (err, user) {
      if (err) {
        return next(err)
      } else {
        req.session.userId=user._id;
        return res.redirect('/users/welcome');
      }
    });
  }
});

//////////////
// GET /logout
//////////////

router.get('/logout', function(req, res, next) {
  console.log("logging out......");
  console.log(req.session.userId);

  req.session.destroy(function(err){
    if(err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  });

});

module.exports = router;