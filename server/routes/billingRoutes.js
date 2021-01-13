const express = require('express');
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const route = express.Router();

route.post('/stripe', async (req, res) => {
  const charge = await stripe.charges.create({
    amount: 500,
    currency: 'usd',
    source: req.body.id,
    description: '$5 for 5 credits',
  });

  req.user.credits += 5;
  const user = await req.user.save();

  res.json(user)
});

module.exports = route;