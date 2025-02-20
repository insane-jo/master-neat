import {Network} from "../../src";

declare const NETWORK_INPUT_AMOUNT: number;
declare const NETWORK_OUTPUT_AMOUNT: number;
declare const TRAINING_SET: any;
declare const TEST_SET: any;
declare const MasterNeat: any;

(window as any).redrawNetworkIterations = 1000;
(window as any).DEFAULT_SETTINGS = {
  mutationAmount: 50,
  mutationRate: .1,
  costFunction: 'MSE', // 'CROSS_ENTROPY',
  selectionFunction: 'FITNESS_PROPORTIONATE',
  elitism: 10
};

(window as any).BROWSER_WORKER_SCRIPT_URL = "../../dist/worker-browser.js";
(window as any).NETWORK_INPUT_AMOUNT = 56;
(window as any).NETWORK_OUTPUT_AMOUNT = 1;

(window as any).DRAW_RESULTS_CALLBACK = (startDate: number) => {
  return (bestNetwork: Network, results: any) => {
    document.getElementById('error')!.innerText = results.error.toFixed(10);
    document.getElementById('fitness')!.innerText = results.fitness.toFixed(10);

    document.getElementById('network')!.innerText = `${NETWORK_INPUT_AMOUNT} - ${bestNetwork.nodes.length - NETWORK_INPUT_AMOUNT - NETWORK_OUTPUT_AMOUNT} - ${NETWORK_OUTPUT_AMOUNT} (${bestNetwork.connections.length})`;

    const currDate = Date.now();
    const msPerIteration = (currDate - startDate) / results.iteration;
    document.getElementById('iteration')!.innerText = `${results.iteration} (${msPerIteration.toFixed(4)} ms)`;

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

    (document!.getElementById('correct-prediction')!).innerText = correct as unknown as string;
    (document.getElementById('incorrect-prediction')!).innerText = incorrect as unknown as string;
    document.getElementById('total-items')!.innerText = total;

    const totalTest = bestNetwork.test(TEST_SET, MasterNeat.methods.cost[(document.getElementById('cost-function')! as any).value]);

    document.getElementById('test-error')!.innerText = totalTest.error.toFixed(10);
  };
}
