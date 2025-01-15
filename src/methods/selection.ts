import {ICommonCollection} from "../types/common-collection";

export type ISelection = {
  name: string;
  power?: number;
  size?: number;
  probability?: number;
};
type ISelectionsCollection = ICommonCollection<ISelection>;

// https://en.wikipedia.org/wiki/Selection_(genetic_algorithm)

const selection:ISelectionsCollection = {
  FITNESS_PROPORTIONATE: {
    name: 'FITNESS_PROPORTIONATE'
  },
  POWER: {
    name: 'POWER',
    power: 4
  },
  TOURNAMENT: {
    name: 'TOURNAMENT',
    size: 5,
    probability: 0.5
  }
};

export default selection;
