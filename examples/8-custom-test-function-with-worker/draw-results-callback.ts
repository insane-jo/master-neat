import fs from "fs";
import {
  NETWORK_INPUT_AMOUNT,
  NETWORK_OUTPUT_AMOUNT, SAVE_NETWORK_ITERATIONS
} from "../7-node-bars-predictor/config";
import {PointData} from "../7-node-bars-predictor/get-points-set";
import CustomNetwork from "./custom-network-test";

export const DRAW_RESULTS_CALLBACK = async (startDate: number, TEST_SET: PointData[], exportFilename: string) => {

  return (bestNetwork: CustomNetwork, results: any) => {
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

    const totalTest = bestNetwork.test(TEST_SET);

    const testError = totalTest.error.toFixed(10);

    console.log(`Iteration: ${iterationTest}. Train error: ${results.error.toFixed(10)}. Test error: ${testError}. Predictions: (+${correct})|(-${incorrect})/${total} (${(correct / total * 100).toFixed(2)}%/${(incorrect / total * 100).toFixed(2)}%) Network configuration: ${networkConfiguration}.`)

    if (results.iteration % SAVE_NETWORK_ITERATIONS == 0) {
      fs.writeFile(
        exportFilename,
        JSON.stringify(bestNetwork),
        () => {}
      );
    }
  };
}
