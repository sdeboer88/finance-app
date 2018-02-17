var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Auth = require('../middleware/requireLogin');

/* GET home page. */
router.get('/', function(req, res) {
    User.find({}, {_id:0,username:1,email:1}, function(err,  data){
        // https://docs.mongodb.com/master/reference/method/db.collection.find/#projection
        if (err)
            res.send(err);

        res.json(data);

    });

});

module.exports = router;