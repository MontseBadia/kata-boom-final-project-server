'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

const kataSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  functionName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tests: [{
    params: [
      Mixed
    ],
    result: {
      type: Mixed,
      required: true
    }
  }]
});

const Kata = mongoose.model('Kata', kataSchema);

module.exports = Kata;
