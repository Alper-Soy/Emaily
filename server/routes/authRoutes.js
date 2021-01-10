const express = require('express');
const passport = require('passport');

const route = express.Router();

route.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
// after client grants permission
// with code that google sent
// passportjs automaticly makes for us this situation.
route.get('/google/callback', passport.authenticate('google'));

module.exports = route;
