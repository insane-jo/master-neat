import {ICommonCollection} from "../types/common-collection";

type IRateFunction = (baseRate: number, iteration: number) => number;
type IRateFunctionBuilder = () => IRateFunction;
type IRateCollection = ICommonCollection<IRateFunctionBuilder>

// https://stackoverflow.com/questions/30033096/what-is-lr-policy-in-caffe/30045244
const rate: IRateCollection = {
  FIXED: () => {
    const func: IRateFunction = function (baseRate, iteration) { return baseRate; };
    return func;
  },
  STEP: (gamma = 0.9, stepSize = 100) => {
    const func: IRateFunction = (baseRate, iteration) => {
      return baseRate * Math.pow(gamma, Math.floor(iteration / stepSize));
    };

    return func;
  },
  EXP: (gamma = 0.999) => {
    const func: IRateFunction = (baseRate, iteration) => {
      return baseRate * Math.pow(gamma, iteration);
    };

    return func;
  },
  INV: (gamma = 0.001, power = 2) => {
    const func: IRateFunction = function (baseRate, iteration) {
      return baseRate * Math.pow(1 + gamma * iteration, -power);
    };

    return func;
  }
};

export default  rate;
