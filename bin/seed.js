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
        params: ['hello'],
        result: 'olleh'
      },
      {
        params: ['barcelona'],
        result: 'anolecrab'
      },
      {
        params: ['laCiudadCondal'],
        result: 'ladnoCdaduiCal'
      },
      {
        params: ['%-te-YO-789/&..p'],
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
