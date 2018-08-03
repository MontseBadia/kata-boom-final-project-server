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
      return res.json(kata);
    });
  });
});

router.post('/:id/check', (req, res, next) => {
  const kataId = req.params.id;
  const inputCode = req.body.inputCode;

  Kata.findById(kataId)
    .then((kata) => {
      const functionName = kata.functionName;
      const tests = kata.tests;
      const params = [];
      const result = [];
      const functionCall = [];
      const evaluation = [];
      let isCorrect = false;

      tests.forEach(test => {
        params.push(test.params);
        result.push(test.result);
      });

      for (let x = 0; x < result.length; x++) {
        if (typeof (params[0][0]) === 'string') { // why is params[0] an array of objects?
          functionCall.push(functionName + '(' + '"' + params[x] + '"' + ')');
          evaluation.push(eval(inputCode + functionCall[x]));
        } else {
          functionCall.push(functionName + '(' + params[x] + ')');
          evaluation.push(eval(inputCode + functionCall[x])); // Verbessern!
        }
      }

      evaluation.forEach((item, index) => {
        if (item !== result[index]) {
          isCorrect = false;
        } else {
          isCorrect = true;
        };
      });

      console.log(isCorrect);

      res.status(200).json(isCorrect);
    })
    .catch(err => {
      res.status(500).json({ code: 'unexpected-identifier' });
      next(err); // do I need next ?
    });
});

module.exports = router;
