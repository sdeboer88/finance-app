var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Auth = require('../middleware/requireLogin');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET route after registering
router.get('/welcome',Auth.requireLogin, function (req, res, next) {
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

// Remove record from mongodb
router.get('/delete/:id',Auth.requireLogin, function(req, res, next) {
    User.findByIdAndRemove({_id: req.params.id},
        function(err, docs){
            if(err) res.json(err);
            else{
                if(req.params.id == req.session.userId){
                    req.session.destroy();
                    res.redirect('/');
                }else{
                    res.redirect('/users/welcome');
                }
            }
        });
});

module.exports = router;