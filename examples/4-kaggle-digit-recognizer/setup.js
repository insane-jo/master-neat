const BROWSER_WORKER_SCRIPT_URL = "../../dist/worker-browser.js";
const NETWORK_INPUT_AMOUNT = 784
const NETWORK_OUTPUT_AMOUNT = 10;
let TRAINING_SET;
let TEST_SET;

let redrawNetworkIterations = 1000;

const DEFAULT_SETTINGS = {
  costFunction: 'BINARY',
  mutationRate: 0.5,
  mutationAmount: 5,
  elitism: 1,
  selectionFunction: 'TOURNAMENT',
  popsize: 50,
  // threads: 4
};

let DRAW_RESULTS_CALLBACK = (startDate) => {
  return (bestNetwork, results) => {
    document.getElementById('error').innerText = results.error.toFixed(10);
    document.getElementById('fitness').innerText = results.fitness.toFixed(10);

    document.getElementById('network').innerText = `${NETWORK_INPUT_AMOUNT} - ${bestNetwork.nodes.length - 2} - ${NETWORK_OUTPUT_AMOUNT} (${bestNetwork.connections.length})`;

    const currDate = Date.now();
    const msPerIteration = (currDate - startDate) / results.iteration;
    document.getElementById('iteration').innerText = `${results.iteration} (${msPerIteration.toFixed(4)} ms)`;

    let correct = 0,
      incorrect = 0,
      total = TEST_SET.length

    for(let i = 0, l = total; i < l; i++) {
      const item = TEST_SET[i];

      const result = bestNetwork.activate(item.input);
      const bestResult = result
        .reduce((res, curr, idx) => {
          if (res.val < curr) {
            return {
              idx,
              val: curr
            }
          }
          return res;
        }, {
          idx: -1,
          val: Number.NEGATIVE_INFINITY
        });

      if (item.output[bestResult.idx] == 1) {
        correct++;
      } else {
        incorrect++;
      }
    }

    document.getElementById('correct-prediction').innerText = correct;
    document.getElementById('incorrect-prediction').innerText = incorrect;
    document.getElementById('total-items').innerText = total;

    const totalTest = bestNetwork.test(TEST_SET, MasterNeat.methods.cost[document.getElementById('cost-function').value]);

    document.getElementById('test-error').innerText = totalTest.error.toFixed(10);
  };
}

async function setup() {

  const readFetchCsv = async (url) => {
    const result = await fetch(url);

    const text = await result.text();

    const data = Papa.parse(text.trim(), {
      header: true,
      delimiter: ","
    });

    return data.data;
  }

  const [
    test,
    train,
    submission
  ] = await Promise.all([
    readFetchCsv('./data/test.csv'),
    readFetchCsv('./data/train.csv'),
    readFetchCsv('./data/sample_submission.csv'),
  ]);

  const testCombined = test
    .map((curr, idx) => {
      const id = idx + 1;
      const label = submission.find((v) => v.ImageId == id).Label;

      return {
        ...curr,
        label
      }
    });

  const inputHeaders = Object.keys(train[0])
    .sort()
    .filter((key) => key.indexOf('pixel') >= 0);

  const outputHeaders = new Array(10)
    .fill('')
    .map((_, idx) => `Category_${idx}`)

  const prepareSet = (collection) => {
    return collection
      .map((curr) => {
        const input = new Uint8Array(inputHeaders.length);
        inputHeaders.forEach((key, idx) => {
          input[idx] = +curr[key];
        });

        input.length = inputHeaders.length;

        const output = new Uint8Array(outputHeaders.length);

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

  const fullSet = prepareSet(train);
  // TRAINING_SET = prepareSet(train);
  // TEST_SET = prepareSet(testCombined);

  // Workaround because submissions label is always 0
  const delimiterIdx = Math.round(fullSet.length * 0.8);
  TRAINING_SET = fullSet.slice(0, delimiterIdx);
  TEST_SET = fullSet.slice(delimiterIdx);

  // debugger;
}

// This promise will be called to render settings component
const readyPromise = setup();
