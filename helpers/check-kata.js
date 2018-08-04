'use strict';

const { VM } = require('vm2');
const vm = new VM({ // Run input code in virtual machine
  require: {
    external: true
  }
});

function checkKata (kata, inputCode) {
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

  return isCorrect;
}

module.exports = checkKata;
