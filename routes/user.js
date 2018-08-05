'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user');

// --- SUBMIT KATA ------
router.post('/me/katas', (req, res, next) => { // check kataId?
  const currentUserId = req.session.currentUser._id;
  const inputCode = req.body.inputCode;
  const kataId = req.body.kataId;

  if (!req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }

  if (!inputCode || !kataId) {
    return res.status(422).json({ code: 'validation' });
  }

  User.findByIdAndUpdate(currentUserId, {
    $push: {
      katas: {
        kata: kataId,
        solution: inputCode
      }
    }
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ code: 'not-found' });
      }
      return res.status(204).send();
    })
    .catch(next);
});

module.exports = router;
