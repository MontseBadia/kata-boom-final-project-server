'use strict';

const express = require('express');
const router = express.Router();

const Kata = require('../models/kata');

// --- GET RANDOM KATA ------
router.get('/random', (req, res, next) => {
  Kata.count()
    .then((count) => {
      const random = Math.floor(Math.random() * count);
      return Kata.findOne().skip(random);
    })
    .then((kata) => {
      return res.json(kata);
    })
    .catch(next); // is it ok?
});

// --- GET ONE KATA ------
router.get('/:name', (req, res, next) => {
  const kataName = req.params.name;
  Kata.findOne({ name: kataName })
    .then((kata) => {
      return res.json(kata);
    })
    .catch(next);
});

router.post('/:id/check', (req, res, next) => {
  const kataId = req.params.id;
  const inputCode = req.body.inputCode;

  if (!inputCode) {
    return res.status(422).json({ code: 'no-input-provided' }); // 422 is fine?
  }

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
