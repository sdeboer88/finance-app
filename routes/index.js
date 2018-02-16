var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Auth = require('../middleware/requireLogin');

/* GET home page. */
router.get('/', Auth.requireLogin,function(req, res, next) {
    console.log(req.session.key);
    // if email key is sent redirect.
    res.render('index', { title: 'Finance App' });
});

//////////////
//    SIGN IN
//////////////

/* GET signin page. */
router.get('/sign-in', function(req, res, next) {
  res.render('signin', { title: 'Sign In' });
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



router.get('/test', Auth.requireLogin,function(req, res) {
  console.log('ID in POST: ', req.session.userId);
  res.send('good');
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
  console.log(req.session.key);

  req.session.destroy(function(err){
    if(err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  });

});


module.exports = router;
