// Specifies in what manner two groups are connected
import {IConncetionCollection} from "../types/methods-collection-types";

const connection: IConncetionCollection = {
  ALL_TO_ALL: {
    name: 'OUTPUT'
  },
  ALL_TO_ELSE: {
    name: 'INPUT'
  },
  ONE_TO_ONE: {
    name: 'SELF'
  }
};

export default  connection;
