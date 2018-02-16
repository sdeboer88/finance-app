var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET route after registering
router.get('/welcome', function (req, res, next) {
    console.log(req.session.userId);
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
            console.log(user);
          if (user === null) {
            var err = new Error('Not authorized! Go back!');
            err.status = 400;
            return next(err);
          } else {
             User.find(function(err, data) {
               res.render('users/welcome', {
                 title: 'Users',
                 users: data,
                 active :{urlUser:true}
               });
             });
          }
        }
      });
});

module.exports = router;