import fs from 'fs';

import {readyPromise} from "../7-node-bars-predictor/setup";
import {
  DEFAULT_SETTINGS,
  NETWORK_INPUT_AMOUNT,
  NETWORK_OUTPUT_AMOUNT,
  GROUP_DATA_BY_DAYS,
  TRAIN_TEST_SPLIT_RATIO,
  POINTS_PER_ITERATION,
  EXPORT_FILENAME_PREFIX,
  ADD_POINT_INDEX_TO_INPUT,
  NORMALIZE_POINTS_DATA
} from "../7-node-bars-predictor/config";
import path from "path";

import {DRAW_RESULTS_CALLBACK} from "./draw-results-callback";

import CustomNetwork from "./custom-network-test";
import {getBarsData} from "../7-node-bars-predictor/get-bars-data";

const exportFilename = `${EXPORT_FILENAME_PREFIX}-network-export-${ADD_POINT_INDEX_TO_INPUT ? `${POINTS_PER_ITERATION}-` : ''}${NETWORK_OUTPUT_AMOUNT}${NORMALIZE_POINTS_DATA ? '-norm' : ''}.json`;
const EXPORT_FILENAME = path.resolve(__dirname, './network-export/' + exportFilename);

readyPromise
  .then(async ({trainSet, testSet}) => {
    let network: CustomNetwork;

    if (!fs.existsSync(path.dirname(EXPORT_FILENAME))) {
      fs.mkdirSync(path.dirname(EXPORT_FILENAME), {recursive: true});
    }

    if (fs.existsSync(EXPORT_FILENAME)) {
      const networkConfiguration = fs.readFileSync(EXPORT_FILENAME, 'utf-8');
      const networkJson = JSON.parse(networkConfiguration);

      network = CustomNetwork.fromJSON(networkJson);
    } else {
      network = new CustomNetwork(NETWORK_INPUT_AMOUNT, NETWORK_OUTPUT_AMOUNT);
    }

    const barsData = await getBarsData(GROUP_DATA_BY_DAYS);
    network.bars = barsData[0].bars.slice(
      Math.round(
        barsData[0].bars.length * TRAIN_TEST_SPLIT_RATIO
      )
    );
    network.pointsPerIteration = POINTS_PER_ITERATION;

    const iterationCallback = await DRAW_RESULTS_CALLBACK(Date.now(), testSet);
    network.evolve(trainSet, {
      ...DEFAULT_SETTINGS,
      scoreTarget: '+',
      error: Number.NEGATIVE_INFINITY,

      callback: iterationCallback
    });
  });
