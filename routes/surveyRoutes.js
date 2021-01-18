const express = require('express');
const Survey = require('../models/survey');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

const router = express.Router();

router.get('/surveys', requireLogin, async (req, res) => {
  const surveys = await Survey.find({ _user: req.user.id }).select({
    recipients: false,
  });

  res.send(surveys);
});

router.get('/surveys/:surveyId/:choice', (req, res) => {
  res.send('Thanks for voting!');
});

router.post('/surveys/webhooks', (req, res) => {
  const p = new Path('/api/surveys/:surveyId/:choice');

  _.chain(req.body)
    .map(({ email, url }) => {
      const match = p.test(new URL(url).pathname);
      if (match) {
        return { email, surveyId: match.surveyId, choice: match.choice };
      }
    })
    .compact()
    .uniqBy('email', 'surveyId')
    .each(({ surveyId, email, choice }) => {
      Survey.updateOne(
        {
          _id: surveyId,
          recipients: {
            $elemMatch: { email: email, responded: false },
          },
        },
        {
          $inc: { [choice]: 1 },
          $set: { 'recipients.$.responded': true },
          lastResponded: new Date(),
        }
      ).exec();
    })
    .value();

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
