const express = require('express');
const Survey = require('../models/survey');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

const router = express.Router();

router.get('/surveys/thanks', (req, res) => {
  res.send('Thanks for voting!');
});

router.post('/surveys/webhooks', (req, res) => {
  console.log(req.body);
  res.send({});
});

router.post('/surveys', requireLogin, requireCredits, async (req, res) => {
  const { title, body, subject, recipients } = req.body;

  const survey = new Survey({
    title,
    body,
    subject,
    recipients: recipients.split(',').map((email) => ({ email: email.trim() })),
    _user: req.user.id,
    dateSent: Date.now(),
  });

  const mailer = new Mailer(survey, surveyTemplate(survey));

  try {
    await mailer.send();
    await survey.save();
    req.user.credits -= 1;
    const user = await req.user.save();

    res.send(user);
  } catch (err) {
    res.status(422).send(err);
  }
});

module.exports = router;
