var population;
// var cycles, sinAllowed;
var points = [];
var divisionLineFunction = function (x) {
  return Math.sin(x) * 0.4 + 0.5;
};

// var divisionLineFunction = function (x) {
//   return Math.tanh(x);
// }

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent('canvascontainer');
  background(61);

  //Draw separation line
  for (let i = 0; i < width; i += 1) {
    fill(50);
    ellipse(i, divisionLineFunction(map(i, 0, width, 0, Math.PI * 4)) * height, 5)
  }

  //Generate and Draw points
  for (let i = 0; i < 1000; i++) {
    let y = Math.random(), x = Math.random() * Math.PI * 4;
    let type = y > divisionLineFunction(x) ? 1 : 0;
    points.push({x: x, y: y, type: type});

    fill(255);
    ellipse(map(points[i].x, 0, Math.PI * 4, 0, width), points[i].y * height, 10)
  }

  start();
}

function start() {
  population = new MasterNeat.Network(2, 1);

  /**
   * @type INetworkTrainingSetItem[]
   */
  const trainingSet = points
    .map((p) => {
      return {
        input: [p.x, p.y],
        output: [p.type]
      }
    });

  const drawResultsCallback = (bestNetwork, results) => {
    let correct1 = 0,
      correct2 = 0,
      incorrect = 0;

    for (let i = 0; i < points.length; i++) {
      push();
      const currPoint = points[i];
      const correctType = currPoint.type;
      const [networkType] = bestNetwork.activate([currPoint.x, currPoint.y]);

      const stepNetworkType = networkType >= 0.5 ? 1 : 0;

      if (correctType === stepNetworkType) {
        if (correctType === 1) {
          fill(0, 255, 0);
          correct1++;
        }

        if (correctType === 0) {
          fill(0, 0, 255);
          correct2++;
        }

      } else {
        fill(255, 0, 0);
        incorrect++;
      }

      ellipse(map(currPoint.x, 0, Math.PI * 4, 0, width), currPoint.y * height, 6)
      pop();
    }

    document.getElementById('correct1-items').innerText = correct1;
    document.getElementById('correct2-items').innerText = correct2;
    document.getElementById('incorrect-items').innerText = incorrect;

    document.getElementById('error').innerText = results.error;
    document.getElementById('fitness').innerText = results.fitness;

    document.getElementById('iteration').innerText = results.iteration;

    drawNetwork(bestNetwork, results);
  };

  population.evolve(trainingSet, {
    mutation: MasterNeat.methods.mutation.FFW,
    equal: true,
    elitism: 10,
    mutationRate: 0.5,
    error: Number.NEGATIVE_INFINITY,
    browserWorkerScriptUrl: "../../dist/worker-browser.js",
    // threads: 4,
    callback: drawResultsCallback
  })
}
