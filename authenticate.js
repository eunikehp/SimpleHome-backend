//implement Local Strategy

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

exports.local = passport.use( new LocalStrategy(User.authenticate())); //Local Strategy requires a verify callback function that verify username and password against the locally stored username and password.
// using session in passport, we need serialize and deserialize
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
