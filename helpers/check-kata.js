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

  for (let x = 0; x < evaluation.length; x++) { // Why do all these values pass to the front as null??
    if (evaluation[x] === null) {
      evaluation[x] = 'null';
    } else if (evaluation[x] === undefined) {
      evaluation[x] = 'undefined';
    } else if (isNaN(evaluation[x]) && typeof (evaluation[x]) === 'number') {
      evaluation[x] = 'NaN';
    }
  }

  const data = {
    isCorrect: isCorrect,
    evaluation: evaluation,
    finalStatus: finalStatus
  };

  return data;
}

module.exports = checkKata;
