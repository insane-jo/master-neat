import path from 'path';
import fs from 'fs';

import Papa from 'papaparse';

import {Network, methods} from '../../src/index';
import {ScoreTargetType} from '../../src/helpers/neat';
import {INetworkTrainingSetItem} from "../../src/architecture/network";

const PATH_TO_DATA_FOLDER = path.resolve(__dirname, '../4-kaggle-digit-recognizer/data');
const PATH_TO_TRAIN_FILE = path.join(PATH_TO_DATA_FOLDER, 'train.csv');

const getDataset = (): {train: INetworkTrainingSetItem[], test: INetworkTrainingSetItem[]} => {
  const csvContent = fs.readFileSync(PATH_TO_TRAIN_FILE, 'utf-8');

  const {data} = Papa.parse(csvContent, {
    header: true,
    delimiter: ","
  }) as { data: any[] };

  const inputHeaders = Object.keys(data[0])
    .sort()
    .filter((key) => key.indexOf('pixel') >= 0);

  const outputHeaders = new Array(10)
    .fill('')
    .map((_, idx) => `Category_${idx}`)

  const prepareSet = (collection: any[]): {input: number[], output: number[]}[] => {
    return collection
      .filter((v) => v.hasOwnProperty('pixel0'))
      .map((curr) => {
        const input = new Array(inputHeaders.length);
        inputHeaders.forEach((key, idx) => {
          input[idx] = +curr[key];
        });

        input.length = inputHeaders.length;

        const output = new Array(outputHeaders.length);

        outputHeaders
          .forEach((_, idx) => {
            output[idx] = +(curr.label == idx);
          });
        output.length = outputHeaders.length;

        return {
          input, output
        }
      });
  };

  const fullSet = prepareSet(data);

  // Workaround because submissions label is always 0
  const delimiterIdx = Math.round(fullSet.length * 0.8);

  const TRAINING_SET = fullSet.slice(0, delimiterIdx);
  const TEST_SET = fullSet.slice(delimiterIdx);

  return {
    train: TRAINING_SET,
    test: TEST_SET
  };
}

const {train, test} = getDataset();
// console.log(dataToTrain);

const DEFAULT_SETTINGS = {
  costFunction: 'FOCAL',
  mutationRate: 0.125,
  mutationAmount: 100,
  elitism: 1,
  selectionFunction: 'TOURNAMENT',
  popsize: 50,
  // threads: 4,
  scoreTarget: '0' as ScoreTargetType
};

const NETWORK_INPUT_AMOUNT = train[0].input.length;
const NETWORK_OUTPUT_AMOUNT = test[0].output.length;

let EVOLVING_NETWORK = new Network(NETWORK_INPUT_AMOUNT, NETWORK_OUTPUT_AMOUNT);

const startDate = Date.now();

EVOLVING_NETWORK.evolve(train, {
  ...DEFAULT_SETTINGS,
  error: Number.NEGATIVE_INFINITY,

  callback: (bestNetwork: Network, results: any) => {
    const error = results.error.toFixed(10);
    const fitness = results.fitness.toFixed(10);
    const iteration = results.iteration;

    const currDate = Date.now();
    const msPerIteration = ((currDate - startDate) / results.iteration).toFixed(4);

    const networkStr = `${NETWORK_INPUT_AMOUNT} - ${bestNetwork.nodes.length - NETWORK_INPUT_AMOUNT - NETWORK_OUTPUT_AMOUNT} - ${NETWORK_OUTPUT_AMOUNT} (${bestNetwork.connections.length})`;

    const currentTest = bestNetwork.test(test, methods.cost[DEFAULT_SETTINGS.costFunction]);

    console.log(`Iteration: ${iteration} (${msPerIteration} ms/iter), Train: (${error}, ${fitness}), Network: ${networkStr}, test error: ${currentTest.error.toFixed(10)}`)
  }
});
