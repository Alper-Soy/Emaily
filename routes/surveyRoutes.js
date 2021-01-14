const express = require('express');
const Survey = require('../models/survey');

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

const route = express.Router();

route.post('/surveys', requireLogin, requireCredits, (req, res) => {});

module.exports = route;
