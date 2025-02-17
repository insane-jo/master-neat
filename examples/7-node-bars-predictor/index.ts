import * as MasterNeat from '../../src/index';

import {readyPromise} from "./setup";
import {DRAW_RESULTS_CALLBACK, DEFAULT_SETTINGS, NETWORK_INPUT_AMOUNT, NETWORK_OUTPUT_AMOUNT} from "./config";

readyPromise
  .then(({trainingSet, testSet}) => {
    const iterationCallback = DRAW_RESULTS_CALLBACK(Date.now(), testSet);

    const network = new MasterNeat.Network(NETWORK_INPUT_AMOUNT, NETWORK_OUTPUT_AMOUNT);

    network.evolve(trainingSet, {
      ...DEFAULT_SETTINGS,
      error: Number.NEGATIVE_INFINITY,

      callback: iterationCallback
    });
  });
