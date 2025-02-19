import * as MasterNeat from '../../src/index';
import {PointData} from "./get-points-set";

import fs from 'fs';
import path from "path";
import {INetworkTrainingOptions} from "../../src/architecture/network";
import {INeatOptions} from "../../src/helpers/neat";

import argparse from 'argparse';

const parser = new argparse.ArgumentParser({
  add_help: true,
});

parser.add_argument(
  '-o',
  '--output',
  {
    // type: 'int',
    choices: ['1', '2'],
    default: 2,
    help: 'Network output amount (1 or 2)'
  }
);

parser.add_argument(
  '-p',
  '--prefix',
  {
    type: 'str',
    default: 'default',
    help: 'Prefix for network export filename'
  }
);

parser.add_argument(
  '-ma',
  '--mutation-amount',
  {
    type: 'int',
    default: 25,
    help: 'Mutation amount (number)'
  }
);

parser.add_argument(
  '-mr',
  '--mutation-rate',
  {
    type: function validator(value: string) {
      const valueToSet = +value;

      if (isNaN(valueToSet)) {
        throw new Error('Provided value for mutation rate is not number');
      }
      if (valueToSet < 0 || valueToSet > 1) {
        throw new Error('Value for mutation rate must be between 0 and 1')
      }

      return valueToSet;
    },
    default: 0.1,
    help: 'Mutation rate (value between 0 and 1)'
  }
);

parser.add_argument(
  '-ps',
  '--popsize',
  {
    type: 'int',
    default: 250,
    help: 'Population size for NEAT algorithm'
  }
);

parser.add_argument(
  '-e',
  '--elitism',
  {
    type: 'int',
    default: 25,
    help: 'Elitism count for NEAT algorithm'
  }
);

parser.add_argument(
  '-pi',
  '--points-per-iteration',
  {
    type: 'int',
    default: 20,
    help: 'Points to generate every iteration for price'
  }
);

parser.add_argument(
  '-g',
  '--group-data-by-days',
  {
    default: 1,
    choices: ['1', '0'],
    help: 'Enable grouping data by days'
  }
);

parser.add_argument(
  '-c',
  '--cost-function',
  {
    choices: Object.keys(MasterNeat.methods.cost),
    default: 'CROSS_ENTROPY',
    type: function validator(value: string) {
      if (!MasterNeat.methods.cost[value]) {
        throw new Error('Provided value for cost function is unknown')
      }

      return value;
    },
    help: 'Cost function to calculate error on evolving'
  }
);

parser.add_argument(
  '-am',
  '--allowed-mutations',
  {
    choices: Object.keys(MasterNeat.methods.mutation),
    default: 'ALL',
    type: function validator(value: string) {
      if (!MasterNeat.methods.mutation[value]) {
        throw new Error('Provided value for allowed mutation is unknown')
      }

      return value;
    },
    help: 'Allowed collection for mutations'
  }
);

parser.add_argument(
  '-cl',
  '--clear',
  {
    default: 1,
    choices: ['1', '0'],
    help: 'Enable clearing of old networks during training'
  }
);

parser.add_argument(
  '-npd',
  '--normalize-points-data',
  {
    default: 1,
    choices: ['1', '0'],
    help: 'Enable min-max normalization of prices and volumes'
  }
);

parser.add_argument(
  '-ts',
  '--train-test-split-ratio',
  {
    type: function (value: string) {
      const valueToSet = +value;

      if (isNaN(valueToSet)) {
        throw new Error('Provided value for train/test split ratio is not a number');
      }
      if (valueToSet < 0 || valueToSet > 1) {
        throw new Error('Value for train/test split ratio must be between 0 and 1')
      }

      return valueToSet;
    },
    default: 0.75,
    help: 'Train/test data split ratio (number between 0 and 1)'
  }
);

parser.add_argument(
  '-efn',
  '--export-filename',
  {
    type: function (value: string) {
      if (!value) {
        return;
      }

      if (!value.endsWith('.json')) {
        throw new Error('Filename for export must have .json extension')
      }

      return value;
    },
    default: '',
    help: 'Export filename for evolving network.'
  }
);

const args = parser.parse_args();

export const DEFAULT_SETTINGS: INetworkTrainingOptions & INeatOptions = {
  mutationAmount: +args.mutation_amount,
  mutationRate: +args.mutation_rate,
  cost: MasterNeat.methods.cost[args.cost_function],
  selection: MasterNeat.methods.selection.POWER,
  elitism: +args.elitism,
  mutation: MasterNeat.methods.mutation[args.allowed_mutations],
  popsize: +args.popsize,
  clear: args.clear == 1
};

export const NORMALIZE_POINTS_DATA = args.normalize_points_data == 1;

export const NETWORK_INPUT_AMOUNT = 56;
export const NETWORK_OUTPUT_AMOUNT = +args.output;
export const GROUP_DATA_BY_DAYS = args.group_data_by_days == 1;

export const TRAIN_TEST_SPLIT_RATIO = +args.train_test_split_ratio;

export const POINTS_PER_ITERATION = +args.points_per_iteration;
export const PRICE_STEP = .01;
export const PRICE_DECIMALS = 2;

const EXPORT_FILENAME_PREFIX = args.prefix;

args.export_filename = args.export_filename || `${EXPORT_FILENAME_PREFIX}-network-export-${NETWORK_OUTPUT_AMOUNT}.json`;
export const EXPORT_FILENAME = path.resolve(__dirname, './network-export/' + args.export_filename);

const SAVE_NETWORK_ITERATIONS = 10;

export const DRAW_RESULTS_CALLBACK = (startDate: number, TEST_SET: PointData[]) => {
  return (bestNetwork: MasterNeat.Network, results: any) => {
    const networkConfiguration = `${NETWORK_INPUT_AMOUNT} - ${bestNetwork.nodes.length - NETWORK_INPUT_AMOUNT - NETWORK_OUTPUT_AMOUNT} - ${NETWORK_OUTPUT_AMOUNT} (${bestNetwork.connections.length})`;

    const currDate = Date.now();
    const msPerIteration = (currDate - startDate) / results.iteration;
    const iterationTest = `${results.iteration} (${msPerIteration.toFixed(4)} ms)`;

    let correct = 0,
      incorrect = 0,
      total = TEST_SET.length;

    if (NETWORK_OUTPUT_AMOUNT === 2) {
      for (let i = 0, l = total; i < l; i++) {
        const testItem = TEST_SET[i];

        const [correctCategory1, correctCategory2] = testItem.output;

        const result = bestNetwork.activate(testItem.input);

        const predictedCategory1 = Math.round(result[0]);
        const predictedCategory2 = Math.round(result[1]);

        if (correctCategory1 === predictedCategory1 && correctCategory2 === predictedCategory2) {
          correct++;
        } else {
          incorrect++;
        }
      }
    } else {
      for (let i = 0, l = total; i < l; i++) {
        const testItem = TEST_SET[i];

        const [correctCategory] = testItem.output;
        const [result] = bestNetwork.activate(testItem.input);

        const predictedCategory = Math.round(result);

        if (correctCategory === predictedCategory) {
          correct++;
        } else {
          incorrect++;
        }
      }
    }

    const totalTest = bestNetwork.test(TEST_SET, MasterNeat.methods.cost.CROSS_ENTROPY);

    const testError = totalTest.error.toFixed(10);

    console.log(`Iteration: ${iterationTest}, train error: ${results.error.toFixed(10)}. Test error: ${testError}. Predictions: (+${correct})|(-${incorrect})/${total} (${(correct / total * 100).toFixed(2)}%/${(incorrect / total * 100).toFixed(2)}%) Network configuration: ${networkConfiguration}.`)

    if (results.iteration % SAVE_NETWORK_ITERATIONS == 0) {
      fs.writeFile(
        EXPORT_FILENAME,
        JSON.stringify(bestNetwork),
        () => {}
      );
    }
  };
}
