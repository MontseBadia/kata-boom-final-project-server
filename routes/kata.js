'use strict';

const express = require('express');
const router = express.Router();

const isKataIdValid = require('../middlewares/is-kata-id-valid');
const checkKata = require('../helpers/check-kata');
const Kata = require('../models/kata');

// --- GET RANDOM KATA ------
router.get('/random', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }

  Kata.count()
    .then((count) => {
      const random = Math.floor(Math.random() * count);
      return Kata.findOne().skip(random);
    })
    .then((kata) => {
      if (!kata) {
        return res.status(404).json(new Error('404')); // Do I need new Error here?
      }
      return res.json(kata.name);
    })
    .catch(next); // is it ok?
});

// --- GET ONE KATA ------
router.get('/:name', (req, res, next) => { // Can this route be the same as the one in the front?
  const kataName = req.params.name;

  if (!req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }

  Kata.findOne({ name: kataName })
    .then((kata) => {
      if (!kata) {
        return res.status(404).json(new Error('404'));
      }
      return res.json(kata);
    })
    .catch((err) => {
      return res.status(500).json(err); // is it ok?
    });
});

// --- CHECK IF KATA IS CORRECT ------
router.post('/:id/check', isKataIdValid, (req, res, next) => { // Do I need to check ID with middleware?
  const kataId = req.params.id;
  const inputCode = req.body.inputCode;

  if (!req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }

  if (!inputCode) {
    return res.status(422).json({ code: 'no-input-provided' });
  }

  Kata.findById(kataId)
    .then((kata) => {
      const data = checkKata(kata, inputCode);
      res.status(200).json(data);
    })
    .catch(() => {
      return res.status(422).json({ code: 'unexpected-identifier' }); // Is 422 ok? How to I include the 500 here?
    });
});

module.exports = router;
