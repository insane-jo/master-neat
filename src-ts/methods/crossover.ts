import {ICommonCollection} from "../types/common-collection";

export interface ICrossover {
  name: string;
  config?: number[];
}
type ICrossoverCollection = ICommonCollection<ICrossover>;

// https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)
const crossover: ICrossoverCollection = {
  SINGLE_POINT: {
    name: 'SINGLE_POINT',
    config: [0.4]
  },
  TWO_POINT: {
    name: 'TWO_POINT',
    config: [0.4, 0.9]
  },
  UNIFORM: {
    name: 'UNIFORM'
  },
  AVERAGE: {
    name: 'AVERAGE'
  }
};

export default crossover;
