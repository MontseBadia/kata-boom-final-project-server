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
  const finalStatus = [];

  tests.forEach(test => {
    params.push(test.params);
    result.push(test.result);
  });

  for (let x = 0; x < result.length; x++) {
    functionCall.push(functionName + '(' + params[x] + ')');
    evaluation.push(vm.run(inputCode + functionCall[x]));
  }

  evaluation.forEach((item, index) => {
    if (item === result[index]) {
      finalStatus.push('CORRECT');
      counter++;
    } else {
      finalStatus.push('INCORRECT');
    }
    if (counter === result.length) {
      isCorrect = true;
    };
  });

  const data = {
    isCorrect: isCorrect,
    evaluation: evaluation,
    finalStatus: finalStatus
  };

  return data;
}

module.exports = checkKata;
