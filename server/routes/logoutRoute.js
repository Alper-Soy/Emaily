const express = require('express');
const route = express.Router();

route.get('/logout', (req, res) => {
  req.logOut();
  res.send(req.user);
});
route.get('/current_user', (req, res) => {
  res.send(req.user);
});

module.exports = route;
