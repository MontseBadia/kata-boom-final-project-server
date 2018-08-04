'use strict';

const express = require('express');
const router = express.Router();
const { VM } = require('vm2');
const vm = new VM({ // Run input code in virtual machine
  require: {
    external: true
  }
});

const isKataIdValid = require('../middlewares/isKataIdValid');
const Kata = require('../models/kata');

// --- GET RANDOM KATA ------
router.get('/random', (req, res, next) => {
  Kata.count()
    .then((count) => {
      const random = Math.floor(Math.random() * count);
      return Kata.findOne().skip(random);
    })
    .then((kata) => {
      if (!kata) {
        return res.status(404).json(new Error('404'));
      }
      return res.json(kata);
    })
    .catch(next); // is it ok?
});

// --- GET ONE KATA ------
router.get('/:name', (req, res, next) => { // Can this route be the same as the one in the front?
  const kataName = req.params.name;
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
      let counter = 0;
      let isCorrect = false;

      tests.forEach(test => {
        params.push(test.params);
        result.push(test.result);
      });

      for (let x = 0; x < result.length; x++) {
        if (typeof (params[0][0]) === 'string') {
          functionCall.push(functionName + '(' + '"' + params[x] + '"' + ')');
          evaluation.push(vm.run(inputCode + functionCall[x]));
          // evaluation.push(eval(inputCode + functionCall[x]));
        } else {
          functionCall.push(functionName + '(' + params[x] + ')');
          evaluation.push(vm.run(inputCode + functionCall[x]));
          // evaluation.push(eval(inputCode + functionCall[x])); // Verbessern!
        }
      }

      evaluation.forEach((item, index) => {
        if (item === result[index]) {
          counter++;
        }
        if (counter === result.length) {
          isCorrect = true;
        };
      });

      res.status(200).json(isCorrect);
    })
    .catch(() => {
      return res.status(422).json({ code: 'unexpected-identifier' }); // Is 422 ok?
    });
});

module.exports = router;
