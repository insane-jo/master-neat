import * as MasterNeat from '../../src/index';

import fs from 'fs';

import {readyPromise} from "./setup";
import {
  DRAW_RESULTS_CALLBACK,
  DEFAULT_SETTINGS,
  NETWORK_INPUT_AMOUNT,
  NETWORK_OUTPUT_AMOUNT,
  EXPORT_FILENAME
} from "./config";
import path from "path";

readyPromise
  .then(async ({trainSet, testSet}) => {
    let network: MasterNeat.Network;

    if (!fs.existsSync(path.dirname(EXPORT_FILENAME))) {
      fs.mkdirSync(path.dirname(EXPORT_FILENAME), {recursive: true});
    }

    if (fs.existsSync(EXPORT_FILENAME)) {
      const networkConfiguration = fs.readFileSync(EXPORT_FILENAME, 'utf-8');
      const networkJson = JSON.parse(networkConfiguration);

      network = MasterNeat.Network.fromJSON(networkJson);
    } else {
      network = new MasterNeat.Network(NETWORK_INPUT_AMOUNT, NETWORK_OUTPUT_AMOUNT);
    }

    const iterationCallback = await DRAW_RESULTS_CALLBACK(Date.now(), testSet);
    network.evolve(trainSet, {
      ...DEFAULT_SETTINGS,
      error: Number.NEGATIVE_INFINITY,

      callback: iterationCallback
    });
  });
