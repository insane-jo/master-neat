import {ICommonCollection} from "../types/common-collection";

export type ICostFunction = (target: number[], output: number[]) => number;
type ICostCollection = ICommonCollection<ICostFunction>;

// https://en.wikipedia.org/wiki/Loss_function
const cost: ICostCollection = {
  // Cross entropy error
  CROSS_ENTROPY: function (target, output) {
    let error: number = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      // Avoid negative and zero numbers, use 1e-15 http://bit.ly/2p5W29A
      const ti = target[i];
      const oi = output[i];

      error -= ti * Math.log(Math.max(oi, 1e-15)) + (1 - ti) * Math.log(1 - Math.max(oi, 1e-15));
    }
    return error / l;
  },
  // Mean Squared Error
  MSE: function (target, output) {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      error += Math.pow(target[i] - output[i], 2);
    }

    return error / l;
  },
  // Binary error
  BINARY: function (target, output) {
    let misses: number = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      misses = misses + Number(Math.round(target[i] * 2) !== Math.round(output[i] * 2));
    }

    return misses;
  },
  // Mean Absolute Error
  MAE: function (target, output) {
    var error = 0;
    const l = output.length;
    for (var i = 0; i < l; i++) {
      error += Math.abs(target[i] - output[i]);
    }

    return error / l;
  },
  // Mean Absolute Percentage Error
  MAPE: function (target, output) {
    var error = 0;
    const l = output.length;
    for (var i = 0; i < l; i++) {
      const ti = target[i];
      error += Math.abs((output[i] - ti) / Math.max(ti, 1e-15));
    }

    return error / l;
  },
  // Mean Squared Logarithmic Error
  MSLE: function (target, output) {
    var error = 0;
    const l = output.length;

    for (var i = 0; i < l; i++) {
      error += Math.log(Math.max(target[i], 1e-15)) - Math.log(Math.max(output[i], 1e-15));
    }

    return error;
  },
  // Hinge loss, for classifiers
  HINGE: function (target, output) {
    var error = 0;
    const l = output.length;

    for (var i = 0; i < l; i++) {
      error += Math.max(0, 1 - target[i] * output[i]);
    }

    return error;
  }
};

export default cost;
