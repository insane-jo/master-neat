import * as MasterNeat from '../../src/index';

import fs from 'fs';
import path from "path";

import {readyPromise} from "./setup";
import {
  DRAW_RESULTS_CALLBACK,
  DEFAULT_SETTINGS,
  NETWORK_INPUT_AMOUNT,
  NETWORK_OUTPUT_AMOUNT,
  GROUP_DATA_BY_DAYS
} from "./config";

readyPromise
  .then(({trainingSet, testSet}) => {
    const iterationCallback = DRAW_RESULTS_CALLBACK(Date.now(), testSet);

    const pathToNetworkFile = path.resolve(__dirname, `./network-export-${GROUP_DATA_BY_DAYS ? '1d' : '15m'}.json`);

    let network: MasterNeat.Network;
    if (fs.existsSync(pathToNetworkFile)) {
      const networkConfiguration = fs.readFileSync(pathToNetworkFile, 'utf-8');
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
