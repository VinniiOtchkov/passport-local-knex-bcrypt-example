var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var bcrypt = require('bcrypt');

//Dummy username and password data
var username = 'blah';
var password = 'blah';

//Function that checks if the user is authenticated, and if they are, then go to the next piece of middleware. If not, redirect to home directory.
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

//Renders the signup view when they go to the extension /signup
router.get('/signup', function(req, res) {
  res.render('signup');
});

//Creates post for signup that takes all inputted information and hashes the password
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

//Gets the users page and checks for authorization and renders the user information as the variable user
router.get('/user', checkAuthed, function(req, res) {
  res.render('user', {
    user: req.user
  });
});

module.exports = router;
