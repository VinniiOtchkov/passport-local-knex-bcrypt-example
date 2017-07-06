var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var bcrypt = require('bcrypt');

var username = 'blah';
var password = 'blah';

function checkAuthed(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/signup', function(req, res) {
  res.render('signup');
});

router.post('/signup', function(req, res) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hashedPassword) {
      knex('users').insert({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      }).then(function() {
        res.redirect('/');
      });
    });
  });
});

router.get('/user', checkAuthed, function(req, res) {
  res.render('user', {
    user: req.user
  });
});

module.exports = router;
