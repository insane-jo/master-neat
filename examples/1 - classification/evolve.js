function evolve() {
  population = new MasterNeat.Network(2, 1);
  const startDate = Date.now();

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
      // push();
      const currPoint = points[i];
      const correctType = currPoint.type;
      const [networkType] = bestNetwork.activate([currPoint.x, currPoint.y]);

      const stepNetworkType = networkType >= 0.5 ? 1 : 0;

      if (correctType === stepNetworkType) {
        if (correctType === 1) {
          correct1++;
        }

        if (correctType === 0) {
          correct2++;
        }

      } else {
        incorrect++;
      }

      // ellipse(map(currPoint.x, 0, Math.PI * 4, 0, width), currPoint.y * height, 6)
      // pop();
      projectPointStyle(i, stepNetworkType, true);
    }


    document.getElementById('correct1-items').innerText = correct1;
    document.getElementById('correct2-items').innerText = correct2;
    document.getElementById('incorrect-items').innerText = incorrect;

    document.getElementById('error').innerText = results.error.toFixed(10);
    document.getElementById('fitness').innerText = results.fitness.toFixed(10);

    document.getElementById('network').innerText = `2 - ${bestNetwork.nodes.length - 3} - 1 (${bestNetwork.connections.length})`;

    const currDate = Date.now();
    const msPerIteration = (currDate - startDate) / results.iteration;
    document.getElementById('iteration').innerText = `${results.iteration} (${msPerIteration.toFixed(4)} ms)`;

    drawNetwork(bestNetwork, results);
  };

  population.evolve(trainingSet, {
    mutation: MasterNeat.methods.mutation.FFW,
    equal: true,
    elitism: 10,
    mutationRate: 0.5,
    error: Number.NEGATIVE_INFINITY,
    browserWorkerScriptUrl: "../../dist/worker-browser.js",
    popsize: 250,
    // threads: 4,
    callback: drawResultsCallback
  })
}
