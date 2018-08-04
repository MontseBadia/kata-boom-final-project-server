'use strict';

const mongoose = require('mongoose');
const User = require('../models/user');
const Kata = require('../models/kata');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const dbName = 'kata-boom';
mongoose.connect(`mongodb://localhost/${dbName}`);

User.collection.drop();
Kata.collection.drop();

const katas = [
  {
    name: 'reverse-a-string',
    functionName: 'reverseString',
    parameters: ['string'],
    description: 'Create a function that will reverse a string. Your final answer must also be a string.',
    tests: [
      {
        params: ['"hello"'],
        result: 'olleh'
      },
      {
        params: ['"barcelona"'],
        result: 'anolecrab'
      },
      {
        params: ['"laCiudadCondal"'],
        result: 'ladnoCdaduiCal'
      },
      {
        params: ['"%-te-YO-789/&..p"'],
        result: 'p..&/987-OY-et-%'
      }]
  },
  {
    name: 'sum-three-numbers',
    functionName: 'sumThreeNumbers',
    parameters: ['num1', 'num2', 'num3'],
    description: 'Create a function that will sum three numbers. Your final answer must also be a number.',
    tests: [
      {
        params: [1, 2, 3],
        result: 6
      },
      {
        params: [2, 5, 2],
        result: 9
      },
      {
        params: [4589064, 6940, 990],
        result: 4596994
      },
      {
        params: [765, 80, 3414],
        result: 4259
      }]
  },
  {
    name: 'vowel-count',
    functionName: 'vowelCount',
    parameters: ['string'],
    description: 'Return the number (count) of vowels (a, e, i, o, u) in the given string.',
    tests: [
      {
        params: ['"abracadabra"'],
        result: 5
      },
      {
        params: ['"underscore"'],
        result: 4
      },
      {
        params: ['"tomorrow"'],
        result: 3
      },
      {
        params: ['"murcielago"'],
        result: 5
      }]
  },
  {
    name: 'compare-strings-by-sum-of-chars',
    functionName: 'compareStrings',
    parameters: ['string1', 'string2'],
    description: 'Compare two strings by comparing the sum of their values (ASCII character code). Your method should return true, if the strings are equal and false if they are not equal.',
    tests: [
      {
        params: ['"ad"', '"bc"'],
        result: true
      },
      {
        params: ['"ads"', '"dds"'],
        result: false
      },
      {
        params: ['"kl"', '"lz"'],
        result: false
      },
      {
        params: ['"gtre"', '"gtre"'],
        result: true
      }]
  }
];

Kata.create(katas)
  .then((katas) => {
    const katasIds = [];
    katas.forEach((item) => {
      katasIds.push(item._id);
    });
    console.log(`Created ${katas.length} katas`);

    const users = [
      {
        username: 'Montse',
        password: bcrypt.hashSync('montse', salt).toString()
      },
      {
        username: 'Laura',
        password: bcrypt.hashSync('laura', salt).toString()
      }
    ];

    return User.create(users)
      .then((users) => {
        console.log(`Created ${users.length} users`);
        mongoose.connection.close();
      });
  })
  .catch((err) => {
    throw (err);
  });
