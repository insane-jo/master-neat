import {IGateCollection} from '../types/methods-gating-types';

// Specifies how to gate a connection between two groups of multiple neurons
const gating: IGateCollection = {
  OUTPUT: {
    name: 'OUTPUT'
  },
  INPUT: {
    name: 'INPUT'
  },
  SELF: {
    name: 'SELF'
  }
};

export default gating;
