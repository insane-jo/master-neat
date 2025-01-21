function evolve() {
  population = new MasterNeat.Network(1, 1);
  const startDate = Date.now();

  const drawResultsCallback = (bestNetwork, results) => {
    // if (results.iteration == 1 || results.iteration % 100 == 0) {
      const predictedPoints = points.map((p) => {
        const x = p.x;
        const [y] = bestNetwork.activate([x]);

        return {x, y};
      });

      drawLineByPoints(predictedPoints, '#ef4444', 'predicted-function');
    // }

    document.getElementById('error').innerText = results.error.toFixed(10);
    document.getElementById('fitness').innerText = results.fitness.toFixed(10);

    document.getElementById('network').innerText = `1 - ${bestNetwork.nodes.length - 2} - 1 (${bestNetwork.connections.length})`;

    const currDate = Date.now();
    const msPerIteration = (currDate - startDate) / results.iteration;
    document.getElementById('iteration').innerText = `${results.iteration} (${msPerIteration.toFixed(4)} ms)`;

    drawNetwork(bestNetwork, results);
  };

  population.evolve(TRAINING_SET, {
    mutation: MasterNeat.methods.mutation.ALL,
    equal: false,
    elitism: 50,
    mutationRate: 0.9,
    mutationAmount: 5,
    error: Number.NEGATIVE_INFINITY,
    browserWorkerScriptUrl: BROWSER_WORKER_SCRIPT_URL,
    popsize: 250,
    cost: MasterNeat.methods.cost.MSE,
    callback: drawResultsCallback
  })
}
