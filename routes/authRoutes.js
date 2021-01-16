const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
// after client grants permission
// with code that google sent
// passportjs automaticly makes for us this situation.
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/surveys');
});

module.exports = router;
