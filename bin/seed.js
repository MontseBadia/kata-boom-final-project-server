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
    name: 'Reverse A String',
    functionName: 'reverseString',
    description: 'Create a function that will reverse a string. Your final answer must also be a string.',
    tests: [
      {
        params: ['hello'],
        result: 'olleh'
      },
      {
        params: ['barcelona'],
        result: 'anolecrab'
      }]
  },
  {
    name: 'Sum Three Numbers',
    functionName: 'sumThreeNumbers',
    description: 'Create a function that will sum three numbers. Your final answer must also be a number.',
    tests: [
      {
        params: [1, 2, 3],
        result: '6'
      },
      {
        params: [2, 5, 2],
        result: '9'
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
