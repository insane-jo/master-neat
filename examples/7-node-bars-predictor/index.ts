import * as MasterNeat from '../../src/index';

import fs from 'fs';

import {readyPromise} from "./setup";
import {
  DRAW_RESULTS_CALLBACK,
  DEFAULT_SETTINGS,
  NETWORK_INPUT_AMOUNT,
  NETWORK_OUTPUT_AMOUNT,
  GROUP_DATA_BY_DAYS, EXPORT_FILENAME
} from "./config";

readyPromise
  .then(({trainingSet, testSet}) => {
    const iterationCallback = DRAW_RESULTS_CALLBACK(Date.now(), testSet);

    let network: MasterNeat.Network;
    if (fs.existsSync(EXPORT_FILENAME)) {
      const networkConfiguration = fs.readFileSync(EXPORT_FILENAME, 'utf-8');
      const networkJson = JSON.parse(networkConfiguration);

      network = MasterNeat.Network.fromJSON(networkJson);
    } else {
      network = new MasterNeat.Network(NETWORK_INPUT_AMOUNT, NETWORK_OUTPUT_AMOUNT);
    }

    network.evolve(trainingSet, {
      ...DEFAULT_SETTINGS,
      error: Number.NEGATIVE_INFINITY,

      callback: iterationCallback
    });
  });
