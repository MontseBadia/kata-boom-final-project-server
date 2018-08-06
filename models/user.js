'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  // email: {
  //   type: string,
  //   required: true,
  //   unique: true
  // },
  password: {
    type: String,
    required: true
  },
  katas: [{
    kata: {
      type: ObjectId,
      ref: 'Kata'
    },
    solution: {
      type: String
    },
    comments: [{
      type: String
    }]
  }],
  friends: [{
    type: ObjectId,
    ref: 'User'
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
