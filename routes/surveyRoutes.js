const express = require('express');
const Survey = require('../models/survey');

const requireLogin = require('../middlewares/requireLogin');

const route = express.Router();

route.post('/surveys', requireLogin, (req, res) => {
    
});

module.exports = route;
