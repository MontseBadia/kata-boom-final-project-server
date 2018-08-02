'use strict';

const express = require('express');
const router = express.Router();

const Kata = require('../models/kata');

// --- GET RANDOM KATA ------
router.get('/random', (req, res, next) => {
  Kata.count().exec((err, count) => {
    if (err) {
      return res.json(err).status(500); // ok?
    }
    const random = Math.floor(Math.random() * count);
    Kata.findOne().skip(random).exec((err, kata) => {
      if (err) {
        return res.json(err).status(500);
      }
      console.log(kata);
      return res.json(kata);
    });
  });
});

module.exports = router;
