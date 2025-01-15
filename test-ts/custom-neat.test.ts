import { expect } from 'chai';

import MasterNeat from '../src-ts';
const {architect} = MasterNeat;


describe('Neat XOR', function () {
  it('Custom test', function () {
    const network = architect.Perceptron(2, 40, 1);

    const trainSet = [{input: [0, 0], output: [0]},
      {input: [0, 1], output: [1]},
      {input: [1, 0], output: [1]},
      {input: [1, 1], output: [0]}];

    network.train(trainSet, {
      // log: 100,
      iterations: 1000,
      error: 0.0001,
      rate: 0.2,
      crossValidate: {
        testSize: 0.4,
        testError: 0.02
      }
    });

    expect(network.activate([0, 1])[0]).greaterThan(0.9);
    expect(network.activate([0, 0])[0]).lessThan(0.1);
  });
});
