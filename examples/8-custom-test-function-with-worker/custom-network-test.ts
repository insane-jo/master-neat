import Network, {INetworkTrainingOptions, INetworkTrainingSetItem, ITestResult} from '../../src/architecture/network';
import {CandleData} from "../common/generate-bars-data";

import Neat, {IFitnessFunction} from "../../src/helpers/neat";

import CustomNodeTestWorker from "./custom-testworker";
import NodeElement from "../../src/architecture/node";

interface ICustomNetworkTrainingOptions extends Omit<INetworkTrainingOptions, 'callback'> {
  callback?: (n: CustomNetwork, result: { error: number, iteration: number, fitness?: number }) => void;
}

export default class CustomNetwork extends Network {
  public pointsPerIteration: number = 20;
  public bars: CandleData[] = [];

  public CORRIDOR_START_PART = .4;
  public CORRIDOR_END_PART = .6;

  test(set: INetworkTrainingSetItem[]): ITestResult {
    // let totalError = 0;
    const barsLength = this.bars.length;

    const startTime = Date.now();

    let portfolioValue = 1;
    let currentPosition = 0;

    const SPREAD_PERCENT = 0.05 / 100;
    const COMISSION_PERCENT = 0.05 / 100;

    // Если переход из 0 в 1 в сигналах происходит внутри этих значений - не торгуем
    // Не торгуем если изменение цены произошло в пивотах между 30 и 70% - только большие колебания ловим
    const NON_TRADE_CORRIDOR_START = Math.round(this.CORRIDOR_START_PART * this.pointsPerIteration),
      NON_TRADE_CORRIDOR_END = Math.round(this.CORRIDOR_END_PART * this.pointsPerIteration) - 1;

    const getTradePrice = (price: number, getBuyPrice: boolean) => {
      if (getBuyPrice) {
        return price * (1 + (SPREAD_PERCENT + COMISSION_PERCENT));
      } else {
        return price * (1 - (SPREAD_PERCENT + COMISSION_PERCENT));
      }
    }

    let lastTradePrice = NaN;

    // Compute error in a single loop
    for (let i = 0; i < barsLength - 2 /*Последнюю свечу проверить не можем*/; i++) {

      const localDecisionMaker = [];
      // Плохим выбором считаем если нули и единицы идут вперемешку
      let isBadDecision = false;
      let lastDecision = -1;

      for (let j = 0; j < this.pointsPerIteration; j++) {
        const {input/*, output: target*/} = set[i * this.pointsPerIteration + j];
        const output = this.noTraceActivate(input);

        const currDecision = Math.round(output[0]);
        if (currDecision < lastDecision) {
          isBadDecision = true;
          break;
        } else {
          lastDecision = currDecision;
        }

        localDecisionMaker.push(currDecision);
      }

      if (currentPosition) {
        if (currentPosition > 0) {
          const firstValue = localDecisionMaker[0],
            lastValue = localDecisionMaker[NON_TRADE_CORRIDOR_START];

          const needToSell = lastValue > firstValue;

          if (needToSell) {
            const tradePrice = getTradePrice(this.bars[i + 1].open, false);

            portfolioValue = currentPosition * tradePrice;
            currentPosition = 0;

            lastTradePrice = NaN;
          }
        } else {
          const firstValue = localDecisionMaker[NON_TRADE_CORRIDOR_END],
            lastValue = localDecisionMaker[localDecisionMaker.length - 1];

          const needToBuy = lastValue > firstValue;
          if (needToBuy) {
            const tradePrice = getTradePrice(this.bars[i + 1].open, true);
            portfolioValue = -(currentPosition * tradePrice);
            currentPosition = 0;

            lastTradePrice = NaN;
          }
        }
      } else {
        if (isBadDecision) {
          // Если плохой вариант для принятия решения - пропускаем
          continue;
        }

        let firstValue = localDecisionMaker[NON_TRADE_CORRIDOR_END],
          lastValue = localDecisionMaker[localDecisionMaker.length - 1];

        const needToBuy = lastValue > firstValue;

        if (needToBuy) {
          const tradePrice = getTradePrice(this.bars[i + 1].open, true);
          currentPosition = portfolioValue / tradePrice;

          lastTradePrice = tradePrice;
        } else {
          firstValue = localDecisionMaker[0];
          lastValue = localDecisionMaker[NON_TRADE_CORRIDOR_START];

          const needToSell = lastValue > firstValue;
          if (needToSell) {
            const tradePrice = getTradePrice(this.bars[i + 1].open, false);
            currentPosition = - (portfolioValue / tradePrice);

            lastTradePrice = tradePrice;
          }
        }
      }
    }

    return {
      error: portfolioValue,
      time: Date.now() - startTime
    };
  }

  async evolve(set: INetworkTrainingSetItem[], options: ICustomNetworkTrainingOptions) {
    if (set[0].input.length !== this.input || set[0].output.length !== this.output) {
      throw new Error('Dataset input/output size should be same as network input/output size!');
    }

    this.isEvolvingStopped = false;

    let resolveEvolve: any;
    this.evolvingPromise = new Promise((resolve) => {
      resolveEvolve = resolve;
    });

    // Read the options
    options = options || {};
    var targetError = typeof options.error !== 'undefined' ? options.error : 0.05;
    var growth = typeof options.growth !== 'undefined' ? options.growth : 0.0001;

    var amount = options.amount || 1;

    var threads = options.threads as number;
    if (typeof threads === 'undefined') {
      threads = require('os').cpus().length;
    }

    var start = Date.now();

    if (typeof options.iterations === 'undefined' && typeof options.error === 'undefined') {
      throw new Error('At least one of the following options must be specified: error, iterations');
    } else if (typeof options.error === 'undefined') {
      targetError = -1; // run until iterations
    } else if (typeof options.iterations === 'undefined') {
      options.iterations = 0; // run until target error
    }

    var fitnessFunction: IFitnessFunction;
    let workers: CustomNodeTestWorker[] = [];

    if (threads === 1) {
      // Create the fitness function
      fitnessFunction = function (genome: CustomNetwork) {
        var score = 0;
        for (var i = 0; i < amount; i++) {
          score -= genome.test(set).error;
        }

        score -= (genome.nodes.length - genome.input - genome.output + genome.connections.length + genome.gates.length) * growth;
        score = isNaN(score) ? -Infinity : score; // this can cause problems with fitness proportionate selection

        return score / amount;
      } as IFitnessFunction;
    } else {

      // Create workers, send datasets
      workers = [];
      for (let i = 0; i < threads; i++) {
        workers.push(new CustomNodeTestWorker(set, this.pointsPerIteration, this.bars));
      }

      fitnessFunction = function (population: CustomNetwork[]): Promise<undefined> {
        return new Promise((resolve) => {
          // Create a queue
          var queue = population.slice();
          var done = 0;

          // Start worker function
          var startWorker = function (worker: CustomNodeTestWorker) {
            if (!queue.length) {
              if (++done === threads) resolve(undefined);
              return;
            }

            var genome: CustomNetwork = queue.shift() as CustomNetwork;

            worker.evaluate(genome).then(function (result: number) {
              genome.score = result;
              genome.score -= (genome.nodes.length - genome.input - genome.output +
                genome.connections.length + genome.gates.length) * growth;
              genome.score = isNaN(parseFloat(result as unknown as string)) ? -Infinity : genome.score;
              startWorker(worker);
            });
          };

          for (var i = 0; i < workers.length; i++) {
            startWorker(workers[i]);
          }
        });
      } as IFitnessFunction;

      options.fitnessPopulation = true;
    }

    // Intialise the NEAT instance
    options.network = this;

    // @todo: выкосить any
    var neat = new Neat(this.input, this.output, fitnessFunction, options);

    var error = -Infinity;
    var bestFitness = -Infinity;
    var bestGenome;

    while (!this.isEvolvingStopped && error < -targetError && (options.iterations === 0 || neat.generation < (options.iterations as number))) {
      let fittestOldNetwork = await neat.evolve();
      let fittest = CustomNetwork.fromJSON(
        fittestOldNetwork.toJSON()
      );
      fittest.score = fittestOldNetwork.score;

      fittest.bars = this.bars;
      fittest.pointsPerIteration = this.pointsPerIteration;

      let fitness = fittest.score as number;
      error = fitness + (fittest.nodes.length - fittest.input - fittest.output + fittest.connections.length + fittest.gates.length) * growth;

      if (fitness > bestFitness) {
        bestFitness = fitness;
        bestGenome = fittest;
      }

      if (options.log && neat.generation % options.log === 0) {
        console.log('iteration', neat.generation, 'fitness', fitness, 'error', -error);
      }

      if (options.schedule && neat.generation % options.schedule.iterations === 0) {
        options.schedule.function({fitness: fitness, error: -error, iteration: neat.generation});
      }

      if (options.callback) {
        options.callback(
          fittest,
          {fitness: fitness, error: error, iteration: neat.generation}
        )
      }
    }

    if (threads > 1) {
      //@ts-ignore
      for (var i = 0; i < workers.length; i++) {
        //@ts-ignore
        workers[i].terminate();
      }
    }

    if (typeof bestGenome !== 'undefined') {
      this.nodes = bestGenome.nodes;
      this.connections = bestGenome.connections;
      this.selfconns = bestGenome.selfconns;
      this.gates = bestGenome.gates;

      if (options.clear) this.clear();
    }

    const returnResult = {
      error: -error,
      iterations: neat.generation,
      time: Date.now() - start
    };

    resolveEvolve(returnResult);

    return returnResult;
  }

  static fromJSON(json: any): CustomNetwork {
    var network = new CustomNetwork(json.input, json.output);
    network.dropout = json.dropout;
    network.nodes = [];
    network.connections = [];

    var i;
    for (i = 0; i < json.nodes.length; i++) {
      network.nodes.push(NodeElement.fromJSON(json.nodes[i]));
    }

    for (i = 0; i < json.connections.length; i++) {
      var conn = json.connections[i];

      var connection = network.connect(network.nodes[conn.from], network.nodes[conn.to])[0];
      connection.weight = conn.weight;

      if (conn.gater != null) {
        network.gate(network.nodes[conn.gater], connection);
      }
    }

    return network;
  }
}
