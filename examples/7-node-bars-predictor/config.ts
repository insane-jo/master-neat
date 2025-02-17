import * as MasterNeat from '../../src/index';
import {PointData} from "./get-points-set";

import fs from 'fs';
import path from "path";
import {INetworkTrainingOptions} from "../../src/architecture/network";
import {INeatOptions} from "../../src/helpers/neat";

export const DEFAULT_SETTINGS: INetworkTrainingOptions & INeatOptions = {
  mutationAmount: 50,
  mutationRate: .1,
  cost: MasterNeat.methods.cost.CROSS_ENTROPY,
  selection: MasterNeat.methods.selection.POWER,
  elitism: 5,
  mutation: MasterNeat.methods.mutation.ALL
};

export const NETWORK_INPUT_AMOUNT = 56;
export const NETWORK_OUTPUT_AMOUNT = 1;

const SAVE_NETWORK_ITERATIONS = 10;

export const DRAW_RESULTS_CALLBACK = (startDate: number, TEST_SET: PointData[]) => {
  return (bestNetwork: MasterNeat.Network, results: any) => {
    const networkConfiguration = `${NETWORK_INPUT_AMOUNT} - ${bestNetwork.nodes.length - NETWORK_INPUT_AMOUNT - NETWORK_OUTPUT_AMOUNT} - ${NETWORK_OUTPUT_AMOUNT} (${bestNetwork.connections.length})`;

    const currDate = Date.now();
    const msPerIteration = (currDate - startDate) / results.iteration;
    const iterationTest = `${results.iteration} (${msPerIteration.toFixed(4)} ms)`;

    let correct = 0,
      incorrect = 0,
      total = TEST_SET.length

    for(let i = 0, l = total; i < l; i++) {
      const item = TEST_SET[i];

      const result = bestNetwork.activate(item.input);

      if (Math.round(result[0]) === item.output[0]) {
        correct++;
      } else {
        incorrect++;
      }
    }

    const totalTest = bestNetwork.test(TEST_SET, MasterNeat.methods.cost.CROSS_ENTROPY);

    const testError = totalTest.error.toFixed(10);

    console.log(`Iteration: ${iterationTest}, train error: ${results.error.toFixed(10)}. Test error: ${testError}. Predictions: (+${correct})|(-${incorrect})/${total} Network configuration: ${networkConfiguration}.`)

    if (results.iteration % SAVE_NETWORK_ITERATIONS == 0) {
      fs.writeFile(
        path.resolve(__dirname, './network-export.json'),
        JSON.stringify(bestNetwork),
        () => {}
      );
    }
  };
}
