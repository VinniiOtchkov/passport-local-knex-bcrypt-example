var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8300;
var cors = require('cors');
var logger = require('morgan');
var knex = require('./db/knex');

//Add these five packages
var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var bcrypt = require('bcrypt');

var index = require('./routes/indexRoutes');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//Let the server use these packages
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/todos', todos);


//Create a new instance of Local Strategy(Predefined username and password checks)
passport.use(new LocalStrategy(
  function(username, password, done) {
    knex('users').select().where('email', username).then(function(user) {
      // Check if user doesn't exist
      if (user.length < 1) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      // Check if password is invalid
      if (!bcrypt.compareSync(password, user[0].password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      // If all passes tests, then let the user in
      return done(null, user[0]);
    });
  }
));

//When the user hits the login button, if they are authenticated, direct them to their user page, if not, redirect back to the home directory
app.post('/login', passport.authenticate('local', {
  successRedirect: '/user',
  failureRedirect: '/'
}));

//Serializes user data
passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user);
});

//Deserializes user data
passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  done(null, id);
});

app.listen(port, function() {
  console.log("listening on port: ", port);
});
