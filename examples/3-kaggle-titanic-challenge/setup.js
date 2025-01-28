const BROWSER_WORKER_SCRIPT_URL = "../../dist/worker-browser.js";
const NETWORK_INPUT_AMOUNT = 12
const NETWORK_OUTPUT_AMOUNT = 1;
let TRAINING_SET;
let TEST_SET;

const DEFAULT_SETTINGS = {
  costFunction: 'BINARY',
  mutationRate: 0.2,
  elitism: 10,
  selectionFunction: 'TOURNAMENT'
};

let DRAW_RESULTS_CALLBACK = (startDate) => {
  return (bestNetwork, results) => {
    document.getElementById('error').innerText = results.error.toFixed(10);
    document.getElementById('fitness').innerText = results.fitness.toFixed(10);

    document.getElementById('network').innerText = `${NETWORK_INPUT_AMOUNT} - ${bestNetwork.nodes.length - 2} - ${NETWORK_OUTPUT_AMOUNT} (${bestNetwork.connections.length})`;

    const currDate = Date.now();
    const msPerIteration = (currDate - startDate) / results.iteration;
    document.getElementById('iteration').innerText = `${results.iteration} (${msPerIteration.toFixed(4)} ms)`;

    drawNetwork(bestNetwork, results, false, "best-network", 400, 600);

    let totalSurvived = 0,
      falsePositiveSurvived = 0,
      truePositiveSurvived = 0,
      totalDied = 0,
      falsePositiveDied = 0,
      truePositiveDied = 0;

    for(let i = 0, l = TEST_SET.length; i < l; i++) {
      const item = TEST_SET[i];

      const [result] = bestNetwork.activate(item.input);

      const isSurvived = Math.round(result);
      const [realSurvived] = item.output;

      if (realSurvived) {
        totalSurvived++;
        if (realSurvived === isSurvived) {
          truePositiveSurvived++
        } else {
          falsePositiveSurvived++;
        }
      } else {
        totalDied++;
        if (realSurvived === isSurvived) {
          truePositiveDied++;
        } else {
          falsePositiveDied++;
        }
      }
    }

    document.getElementById('survived-false-positive').innerText = falsePositiveSurvived;
    document.getElementById('survived-true-positive').innerText = truePositiveSurvived;
    document.getElementById('survived-total').innerText = `(${totalSurvived})`;

    document.getElementById('died-false-positive').innerText = falsePositiveDied;
    document.getElementById('died-true-positive').innerText = truePositiveDied;
    document.getElementById('died-total').innerText = `(${totalDied})`;

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
    readFetchCsv('./data/gender_submission.csv'),
  ]);

  // console.log([test, train, submission]);

  const testCombined = test
    .map((curr) => {
      const id = curr.PassengerId;
      const Survived = submission.find((v) => v.PassengerId == id).Survived;

      return {
        ...curr,
        Survived
      }
    });

  const prepareSet = (collection) => {
    const preparedCollection = collection
      .map((curr) => {
        return {
          ...curr,
          Pclass_1: curr.Pclass == 1,
          Pclass_2: curr.Pclass == 2,
          Pclass_3: curr.Pclass == 3,
          Sex_male: curr.Sex == 'male',
          Sex_female: curr.Sex == 'female',
          Embarked_C: curr.Embarked == 'C',
          Embarked_S: curr.Embarked == 'S',
          Embarked_Q: curr.Embarked == 'Q'
        }
      });

    return preparedCollection
      .map((curr) => {
        return {
          input: [
            +curr.Pclass_1,
            +curr.Pclass_2,
            +curr.Pclass_3,
            +curr.Sex_male,
            +curr.Sex_female,
            +curr.Age,
            +curr.SibSp,
            +curr.Parch,
            +curr.Fare,
            +curr.Embarked_C,
            +curr.Embarked_S,
            +curr.Embarked_Q
          ],
          output: [
            +curr.Survived
          ]
        }
      });
  };

  TRAINING_SET = prepareSet(train);
  TEST_SET = prepareSet(testCombined);
}

// This promise will be called to render settings component
const readyPromise = setup();
