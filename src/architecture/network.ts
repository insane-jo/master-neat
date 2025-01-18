import {ICostFunction} from "../methods/cost";
import {IMutation} from "../methods/mutation";
import {IActivationFunction} from "../types/activation-types";
import Connection from "./connection";
import NodeElement from "./node";

/* Import */
import * as multi from '../multithreading/multi';
import methods from '../methods/methods';
import config from '../config';
import Neat, {IFitnessFunction} from '../neat';
import BrowserTestWorker from "../multithreading/workers/browser/testworker";
import NodeTestWorker from "../multithreading/workers/node/testworker";
import {NodeTypeEnum} from "../types/node-type-enum";
import {IRateFunction} from "../methods/rate";
import subNode from "../methods/mutation/sub-node";

export type INetworkTrainingSetItem = { input: number[], output: number[] };

export type INetworkTrainingOptions = {
  error?: number;
  rate?: number;
  dropout?: number;
  momentum?: number;
  batchSize?: number;
  cost?: ICostFunction;
  iterations?: number;
  browserWorkerScriptUrl?: string;
  popsize?: number;

  mutation?: IMutation[];
  equal?: boolean;
  elitism?: number;
  mutationRate?: number;

  ratePolicy?: IRateFunction;

  crossValidate?: {
    testSize: number;
    testError: number;
  };

  clear?: boolean;
  shuffle?: boolean;

  log?: number;

  schedule?: {
    iterations: number;
    function: (x: { error: number, iteration: number, fitness?: number }) => void;
  };

  growth?: number;
  amount?: number;
  threads?: number;

  fitnessPopulation?: boolean;

  network?: Network;

  callback?: (n: Network, result: { error: number, iteration: number, fitness?: number }) => void;
};

export default class Network {
  public nodes: NodeElement[];
  public connections: Connection[];
  public input: number;
  public output: number;
  public dropout: number;
  public gates: Connection[];
  public selfconns: Connection[];

  public score?: number;

  constructor(input: number, output: number) {
    if (typeof input === 'undefined' || typeof output === 'undefined') {
      throw new Error('No input or output size given');
    }

    this.input = input;
    this.output = output;

    // Store all the node and connection genes
    this.nodes = []; // Stored in activation order
    this.connections = [];
    this.gates = [];
    this.selfconns = [];

    // Regularization
    this.dropout = 0;

    // Create input and output nodes
    for (let i = 0; i < this.input + this.output; i++) {
      var type = i < this.input ? NodeTypeEnum.input : NodeTypeEnum.output;
      this.nodes.push(new NodeElement(type));
    }

    // Connect input nodes with output nodes directly
    for (let i = 0; i < this.input; i++) {
      for (var j = this.input; j < this.output + this.input; j++) {
        // https://stats.stackexchange.com/a/248040/147931
        var weight = Math.random() * this.input * Math.sqrt(2 / this.input);
        this.connect(this.nodes[i], this.nodes[j], weight);
      }
    }
  }

  /**
   * Activates the network
   */
  activate(input: number[], training?: boolean) {
    var output = [];

    // Activate nodes chronologically
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].type === NodeTypeEnum.input) {
        this.nodes[i].activate(input[i]);
      } else if (this.nodes[i].type === NodeTypeEnum.output) {
        var activation = this.nodes[i].activate();
        output.push(activation);
      } else {
        if (training) this.nodes[i].mask = Math.random() < this.dropout ? 0 : 1;
        this.nodes[i].activate();
      }
    }

    return output;
  }

  /**
   * Activates the network without calculating elegibility traces and such
   */
  noTraceActivate(input: number[]) {
    var output = [];

    // Activate nodes chronologically
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].type === NodeTypeEnum.input) {
        this.nodes[i].noTraceActivate(input[i]);
      } else if (this.nodes[i].type === NodeTypeEnum.output) {
        var activation = this.nodes[i].noTraceActivate();
        output.push(activation);
      } else {
        this.nodes[i].noTraceActivate();
      }
    }

    return output;
  }

  /**
   * Backpropagate the network
   */
  propagate(rate: number, momentum: number, update: boolean, target: number[]) {
    if (typeof target === 'undefined' || target.length !== this.output) {
      throw new Error('Output target length should match network output length');
    }

    var targetIndex = target.length;

    // Propagate output nodes
    var i;
    for (i = this.nodes.length - 1; i >= this.nodes.length - this.output; i--) {
      this.nodes[i].propagate(rate, momentum, update, target[--targetIndex]);
    }

    // Propagate hidden and input nodes
    for (i = this.nodes.length - this.output - 1; i >= this.input; i--) {
      this.nodes[i].propagate(rate, momentum, update);
    }
  }

  /**
   * Clear the context of the network
   */
  clear() {
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].clear();
    }
  }

  /**
   * Connects the from node to the to node
   */
  connect(from: NodeElement, to: NodeElement, weight?: number) {
    const connections: Connection[] = from.connect(to, weight);

    for (let i = 0; i < connections.length; i++) {
      const connection: Connection = connections[i];
      if (from !== to) {
        this.connections.push(connection);
      } else {
        this.selfconns.push(connection);
      }
    }

    return connections;
  }

  /**
   * Disconnects the from node from the to node
   */
  disconnect(from: NodeElement, to: NodeElement) {
    // Delete the connection in the network's connection array
    var connections = from === to ? this.selfconns : this.connections;

    for (var i = 0; i < connections.length; i++) {
      var connection = connections[i];
      if (connection.from === from && connection.to === to) {
        if (connection.gater !== null) this.ungate(connection);
        connections.splice(i, 1);
        break;
      }
    }

    // Delete the connection at the sending and receiving neuron
    from.disconnect(to);
  }

  /**
   * Gate a connection with a node
   */
  gate(node: NodeElement, connection: Connection) {
    if (this.nodes.indexOf(node) === -1) {
      throw new Error('This node is not part of the network!');
    } else if (connection.gater != null) {
      if (config.warnings) console.warn('This connection is already gated!');
      return;
    }
    node.gate(connection);
    this.gates.push(connection);
  }

  /**
   *  Remove the gate of a connection
   */
  ungate(connection: Connection) {
    var index = this.gates.indexOf(connection);
    if (index === -1) {
      throw new Error('This connection is not gated!');
    }

    this.gates.splice(index, 1);
    connection.gater?.ungate(connection);
  }

  /**
   *  Removes a node from the network
   */
  remove(node: NodeElement) {
    var index = this.nodes.indexOf(node);

    if (index === -1) {
      throw new Error('This node does not exist in the network!');
    }

    // Keep track of gaters
    var gaters = [];

    // Remove selfconnections from this.selfconns
    this.disconnect(node, node);

    // Get all its inputting nodes
    var inputs = [];
    for (var i = node.connections.in.length - 1; i >= 0; i--) {
      let connection = node.connections.in[i];
      if (subNode.keep_gates && connection.gater !== null && connection.gater !== node) {
        gaters.push(connection.gater);
      }
      inputs.push(connection.from);
      this.disconnect(connection.from, node);
    }

    // Get all its outputing nodes
    var outputs = [];
    for (i = node.connections.out.length - 1; i >= 0; i--) {
      let connection = node.connections.out[i];
      if (subNode.keep_gates && connection.gater !== null && connection.gater !== node) {
        gaters.push(connection.gater);
      }
      outputs.push(connection.to);
      this.disconnect(node, connection.to);
    }

    // Connect the input nodes to the output nodes (if not already connected)
    var connections = [];
    for (i = 0; i < inputs.length; i++) {
      let input = inputs[i];
      for (var j = 0; j < outputs.length; j++) {
        let output = outputs[j];
        if (!input.isProjectingTo(output)) {
          var conn = this.connect(input, output);
          connections.push(conn[0]);
        }
      }
    }

    // Gate random connections with gaters
    for (i = 0; i < gaters.length; i++) {
      if (connections.length === 0) break;

      let gater = gaters[i];
      let connIndex = Math.floor(Math.random() * connections.length);

      this.gate(gater, connections[connIndex]);
      connections.splice(connIndex, 1);
    }

    // Remove gated connections gated by this node
    for (i = node.connections.gated.length - 1; i >= 0; i--) {
      let conn = node.connections.gated[i];
      this.ungate(conn);
    }

    // Remove selfconnection
    this.disconnect(node, node);

    // Remove the node from this.nodes
    this.nodes.splice(index, 1);
  }

  /**
   * Mutates the network with the given method
   */
  mutate(method?: IMutation) {
    if (typeof method === 'undefined') {
      throw new Error('No (correct) mutate method given!');
    }

    method.callback(this);
  }

  /**
   * Train the given set to this network
   */
  train(set: INetworkTrainingSetItem[], options: INetworkTrainingOptions = {}) {
    if (set[0].input.length !== this.input || set[0].output.length !== this.output) {
      throw new Error('Dataset input/output size should be same as network input/output size!');
    }

    // Warning messages
    if (typeof options.rate === 'undefined') {
      if (config.warnings) console.warn('Using default learning rate, please define a rate!');
    }
    if (typeof options.iterations === 'undefined') {
      if (config.warnings) console.warn('No target iterations given, running until error is reached!');
    }

    // Read the options
    var targetError = options.error || 0.05;
    var cost = options.cost || methods.cost.MSE;
    var baseRate = options.rate || 0.3;
    var dropout = options.dropout || 0;
    var momentum = options.momentum || 0;
    var batchSize = options.batchSize || 1; // online learning
    var ratePolicy = options.ratePolicy || methods.rate.FIXED();

    var start = Date.now();

    if (batchSize > set.length) {
      throw new Error('Batch size must be smaller or equal to dataset length!');
    } else if (typeof options.iterations === 'undefined' && typeof options.error === 'undefined') {
      throw new Error('At least one of the following options must be specified: error, iterations');
    } else if (typeof options.error === 'undefined') {
      targetError = -1; // run until iterations
    } else if (typeof options.iterations === 'undefined') {
      options.iterations = 0; // run until target error
    }

    // Save to network
    this.dropout = dropout;

    let trainSet: INetworkTrainingSetItem[] = [],
      testSet: INetworkTrainingSetItem[] = [];

    if (options.crossValidate) {
      let numTrain = Math.ceil((1 - options.crossValidate.testSize) * set.length);
      trainSet = set.slice(0, numTrain);
      testSet = set.slice(numTrain);
    }

    // Loops the training process
    var currentRate = baseRate;
    var iteration = 0;
    var error = 1;

    // var i, j, x;
    while (error > targetError && (options.iterations === 0 || iteration < (options.iterations as number))) {
      if (options.crossValidate && error <= options.crossValidate.testError) break;

      iteration++;

      // Update the rate
      currentRate = ratePolicy(baseRate, iteration);

      // Checks if cross validation is enabled
      if (options.crossValidate) {
        this._trainSet(trainSet, batchSize, currentRate, momentum, cost);
        if (options.clear) this.clear();
        error = this.test(testSet, cost).error;
        if (options.clear) this.clear();
      } else {
        error = this._trainSet(set, batchSize, currentRate, momentum, cost);
        if (options.clear) this.clear();
      }

      // Checks for options such as scheduled logs and shuffling
      if (options.shuffle) {

        for (let j, x, i = set.length; i; j = Math.floor(Math.random() * i), x = set[--i], set[i] = set[j], set[j] = x) ;
      }

      if (options.log && iteration % options.log === 0) {
        console.log('iteration', iteration, 'error', error, 'rate', currentRate);
      }

      if (options.schedule && iteration % options.schedule.iterations === 0) {
        options.schedule.function({error: error, iteration: iteration});
      }
    }

    if (options.clear) this.clear();

    if (dropout) {
      for (let i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].type === NodeTypeEnum.hidden || this.nodes[i].type === NodeTypeEnum.constant) {
          this.nodes[i].mask = 1 - this.dropout;
        }
      }
    }

    return {
      error: error,
      iterations: iteration,
      time: Date.now() - start
    };
  }

  /**
   * Performs one training epoch and returns the error
   * private function used in this.train
   */
  _trainSet(set: INetworkTrainingSetItem[], batchSize: number, currentRate: number, momentum: number, costFunction: ICostFunction) {
    let errorSum = 0;
    for (var i = 0; i < set.length; i++) {
      const input = set[i].input;
      const target = set[i].output;

      const update = ((i + 1) % batchSize === 0 || (i + 1) === set.length);

      const output = this.activate(input, true);
      this.propagate(currentRate, momentum, update, target);

      errorSum += costFunction(target, output);
    }
    return errorSum / set.length;
  }

  /**
   * Tests a set and returns the error and elapsed time
   */
  test(set: INetworkTrainingSetItem[], cost = methods.cost.MSE) {
    // Check if dropout is enabled, set correct mask
    var i;
    if (this.dropout) {
      for (i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].type === NodeTypeEnum.hidden || this.nodes[i].type === NodeTypeEnum.constant) {
          this.nodes[i].mask = 1 - this.dropout;
        }
      }
    }

    var error = 0;
    var start = Date.now();

    for (i = 0; i < set.length; i++) {
      let input = set[i].input;
      let target = set[i].output;
      let output = this.noTraceActivate(input);
      error += cost(target, output);
    }

    error /= set.length;

    return {
      error: error,
      time: Date.now() - start
    };
  }

  /**
   * Convert the network to a json object
   */
  toJSON() {
    var json = {
      nodes: [] as any[],
      connections: [] as any[],
      input: this.input,
      output: this.output,
      dropout: this.dropout
    };

    // So we don't have to use expensive .indexOf()
    for (let i = 0; i < this.nodes.length; i++) {
      (this.nodes[i] as any).index = i;
    }

    for (let i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      let tojson = node.toJSON() as any;
      tojson.index = i;
      json.nodes.push(tojson);

      if (node.connections.self.weight !== 0) {
        let tojson = node.connections.self.toJSON() as any;
        tojson.from = i;
        tojson.to = i;

        tojson.gater = node.connections.self.gater != null ? (node.connections.self.gater as any).index : null;
        json.connections.push(tojson);
      }
    }

    for (let i = 0; i < this.connections.length; i++) {
      let conn = this.connections[i];
      let tojson = conn.toJSON() as any;
      tojson.from = (conn.from as any).index;
      tojson.to = (conn.to as any).index;

      tojson.gater = conn.gater != null ? (conn.gater as any).index : null;

      json.connections.push(tojson);
    }

    return json;
  }

  /**
   * Sets the value of a property for every node in this network
   */
  set(values: { bias?: number; squash?: IActivationFunction }) {
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].bias = values.bias || this.nodes[i].bias;
      this.nodes[i].squash = values.squash || this.nodes[i].squash;
    }
  }

  /**
   * Evolves the network to reach a lower error on a dataset
   */
  async evolve(set: INetworkTrainingSetItem[], options: INetworkTrainingOptions) {
    if (set[0].input.length !== this.input || set[0].output.length !== this.output) {
      throw new Error('Dataset input/output size should be same as network input/output size!');
    }

    // Read the options
    options = options || {};
    var targetError = typeof options.error !== 'undefined' ? options.error : 0.05;
    var growth = typeof options.growth !== 'undefined' ? options.growth : 0.0001;
    var cost = options.cost || methods.cost.MSE;
    var amount = options.amount || 1;

    var threads = options.threads as number;
    if (typeof threads === 'undefined') {
      if (typeof window === 'undefined') { // Node.js
        threads = require('os').cpus().length;
      } else { // Browser
        threads = navigator.hardwareConcurrency;
      }
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
    let workers: (BrowserTestWorker | NodeTestWorker)[] = [];

    if (typeof window !== 'undefined' && options.browserWorkerScriptUrl == undefined) {
      threads = 1;
    }

    if (threads === 1) {
      // Create the fitness function
      fitnessFunction = function (genome: Network) {
        var score = 0;
        for (var i = 0; i < amount; i++) {
          score -= genome.test(set, cost).error;
        }

        score -= (genome.nodes.length - genome.input - genome.output + genome.connections.length + genome.gates.length) * growth;
        score = isNaN(score) ? -Infinity : score; // this can cause problems with fitness proportionate selection

        return score / amount;
      } as IFitnessFunction;
    } else {

      // Create workers, send datasets
      workers = [];
      if (typeof window === 'undefined') {
        for (let i = 0; i < threads; i++) {
          workers.push(new multi.workers.node.TestWorker(set, cost));
        }
      } else {
        for (let i = 0; i < threads; i++) {
          workers.push(new multi.workers.browser.TestWorker(options.browserWorkerScriptUrl as string, set, cost));
        }
      }

      fitnessFunction = function (population: Network[]): Promise<undefined> {
        return new Promise((resolve) => {
          // Create a queue
          var queue = population.slice();
          var done = 0;

          // Start worker function
          var startWorker = function (worker: BrowserTestWorker | NodeTestWorker) {
            if (!queue.length) {
              if (++done === threads) resolve(undefined);
              return;
            }

            var genome: Network = queue.shift() as Network;

            worker.evaluate(genome).then(function (result: number) {
              genome.score = -result;
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

    while (error < -targetError && (options.iterations === 0 || neat.generation < (options.iterations as number))) {
      let fittest = await neat.evolve();
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
          {fitness: fitness, error: -error, iteration: neat.generation}
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

    return {
      error: -error,
      iterations: neat.generation,
      time: Date.now() - start
    };
  }

  /**
   * Creates a standalone function of the network which can be run without the
   * need of a library
   */
  standalone() {
    var present = [];
    var activations = [];
    var states = [];
    var lines = [];
    var functions = [];

    var i;
    for (i = 0; i < this.input; i++) {
      var node = this.nodes[i];
      activations.push(node.activation);
      states.push(node.state);
    }

    lines.push('for(var i = 0; i < input.length; i++) A[i] = input[i];');

    // So we don't have to use expensive .indexOf()
    for (i = 0; i < this.nodes.length; i++) {
      (this.nodes[i] as any).index = i;
    }

    for (i = this.input; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      activations.push(node.activation);
      states.push(node.state);

      var functionIndex = present.indexOf(node.squash.name);

      if (functionIndex === -1) {
        functionIndex = present.length;
        present.push(node.squash.name);
        functions.push(node.squash.toString());
      }

      var incoming = [];
      for (var j = 0; j < node.connections.in.length; j++) {
        var conn = node.connections.in[j];
        var computation = `A[${(conn.from as any).index}] * ${conn.weight}`;

        if (conn.gater != null) {
          computation += ` * A[${(conn.gater as any).index}]`;
        }

        incoming.push(computation);
      }

      if (node.connections.self.weight) {
        let conn = node.connections.self;
        let computation = `S[${i}] * ${conn.weight}`;

        if (conn.gater != null) {
          computation += ` * A[${(conn.gater as any).index}]`;
        }

        incoming.push(computation);
      }

      var line1 = `S[${i}] = ${incoming.join(' + ')} + ${node.bias};`;
      var line2 = `A[${i}] = F[${functionIndex}](S[${i}])${!node.mask ? ' * ' + node.mask : ''};`;
      lines.push(line1);
      lines.push(line2);
    }

    var output = [];
    for (i = this.nodes.length - this.output; i < this.nodes.length; i++) {
      output.push(`A[${i}]`);
    }

    lines.push(
      `return [${output.join(',')}];`
    );

    var total = '';
    total += `var F = [${functions.toString()}];\r\n`;
    total += `var A = [${activations.toString()}];\r\n`;
    total += `var S = [${states.toString()}];\r\n`;
    total += `activate = function(input){\r\n${lines.join('\r\n')}\r\n}`;

    return total;
  }

  /**
   * Serialize to send to workers efficiently
   */
  serialize() {
    var activations: number[] = [];
    var states: number[] = [];
    var conns: number[] = [];
    var squashes = [
      'LOGISTIC', 'TANH', 'IDENTITY', 'STEP', 'RELU', 'SOFTSIGN', 'SINUSOID',
      'GAUSSIAN', 'BENT_IDENTITY', 'BIPOLAR', 'BIPOLAR_SIGMOID', 'HARD_TANH',
      'ABSOLUTE', 'INVERSE', 'SELU'
    ];

    conns.push(this.input);
    conns.push(this.output);

    var i;
    for (i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      (node as any).index = i;
      activations.push(node.activation);
      states.push(node.state);
    }

    for (i = this.input; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      conns.push((node as any).index as number);
      conns.push(node.bias);
      conns.push(squashes.indexOf(node.squash.name));

      conns.push(node.connections.self.weight);
      conns.push(node.connections.self.gater == null ? -1 : (node.connections.self.gater as any).index);

      for (var j = 0; j < node.connections.in.length; j++) {
        let conn = node.connections.in[j];

        conns.push((conn.from as any).index);
        conns.push(conn.weight);
        conns.push(conn.gater == null ? -1 : (conn.gater as any).index);
      }

      conns.push(-2); // stop token -> next node
    }

    return [activations, states, conns];
  }

  /**
   * Convert a json object to a network
   */
  static fromJSON(json: any): Network {
    var network = new Network(json.input, json.output);
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

  /**
   * Merge two networks into one
   */
  static merge(network1: Network, network2: Network) {
    // Create a copy of the networks
    network1 = Network.fromJSON(network1.toJSON());
    network2 = Network.fromJSON(network2.toJSON());

    // Check if output and input size are the same
    if (network1.output !== network2.input) {
      throw new Error('Output size of network1 should be the same as the input size of network2!');
    }

    // Redirect all connections from network2 input from network1 output
    var i;
    for (i = 0; i < network2.connections.length; i++) {
      let conn = network2.connections[i];
      if (conn.from.type === NodeTypeEnum.input) {
        let index = network2.nodes.indexOf(conn.from);

        // redirect
        conn.from = network1.nodes[network1.nodes.length - 1 - index];
      }
    }

    // Delete input nodes of network2
    for (i = network2.input - 1; i >= 0; i--) {
      network2.nodes.splice(i, 1);
    }

    // Change the node type of network1's output nodes (now hidden)
    for (i = network1.nodes.length - network1.output; i < network1.nodes.length; i++) {
      network1.nodes[i].type = NodeTypeEnum.hidden;
    }

    // Create one network from both networks
    network1.connections = network1.connections.concat(network2.connections);
    network1.nodes = network1.nodes.concat(network2.nodes);

    return network1;
  }

  /**
   * Create an offspring from two parent networks
   */
  static crossOver(network1: Network, network2: Network, equal?: boolean) {
    if (network1.input !== network2.input || network1.output !== network2.output) {
      throw new Error("Networks don't have the same input/output size!");
    }

    // Initialise offspring
    var offspring = new Network(network1.input, network1.output);
    offspring.connections = [];
    offspring.nodes = [];

    // Save scores and create a copy
    var score1 = network1.score || 0;
    var score2 = network2.score || 0;

    // Determine offspring node size
    var size;
    if (equal || score1 === score2) {
      let max = Math.max(network1.nodes.length, network2.nodes.length);
      let min = Math.min(network1.nodes.length, network2.nodes.length);
      size = Math.floor(Math.random() * (max - min + 1) + min);
    } else if (score1 > score2) {
      size = network1.nodes.length;
    } else {
      size = network2.nodes.length;
    }

    // Rename some variables for easier reading
    var outputSize = network1.output;

    // Set indexes so we don't need indexOf
    var i;
    for (i = 0; i < network1.nodes.length; i++) {
      (network1.nodes[i] as any).index = i;
    }

    for (i = 0; i < network2.nodes.length; i++) {
      (network2.nodes[i] as any).index = i;
    }

    // Assign nodes from parents to offspring
    for (i = 0; i < size; i++) {
      // Determine if an output node is needed
      var node;
      if (i < size - outputSize) {
        let random = Math.random();
        node = random >= 0.5 ? network1.nodes[i] : network2.nodes[i];
        let other = random < 0.5 ? network1.nodes[i] : network2.nodes[i];

        if (typeof node === 'undefined' || node.type === NodeTypeEnum.output) {
          node = other;
        }
      } else {
        if (Math.random() >= 0.5) {
          node = network1.nodes[network1.nodes.length + i - size];
        } else {
          node = network2.nodes[network2.nodes.length + i - size];
        }
      }

      var newNode = new NodeElement();
      newNode.bias = node.bias;
      newNode.squash = node.squash;
      newNode.type = node.type;

      offspring.nodes.push(newNode);
    }

    // Create arrays of connection genes
    var n1conns: { [key: number]: any } = {};
    var n2conns: { [key: number]: any } = {};

    // Normal connections
    for (i = 0; i < network1.connections.length; i++) {
      let conn = network1.connections[i];
      let data = {
        weight: conn.weight,
        from: (conn.from as any).index,
        to: (conn.to as any).index,
        gater: conn.gater != null ? (conn.gater as any).index : -1
      };
      n1conns[Connection.innovationID(data.from, data.to)] = data;
    }

    // Selfconnections
    for (i = 0; i < network1.selfconns.length; i++) {
      let conn = network1.selfconns[i];
      let data = {
        weight: conn.weight,
        from: (conn.from as any).index,
        to: (conn.to as any).index,
        gater: conn.gater != null ? (conn.gater as any).index : -1
      };
      n1conns[Connection.innovationID(data.from, data.to)] = data;
    }

    // Normal connections
    for (i = 0; i < network2.connections.length; i++) {
      let conn = network2.connections[i];
      let data = {
        weight: conn.weight,
        from: (conn.from as any).index,
        to: (conn.to as any).index,
        gater: conn.gater != null ? (conn.gater as any).index : -1
      };
      n2conns[Connection.innovationID(data.from, data.to)] = data;
    }

    // Selfconnections
    for (i = 0; i < network2.selfconns.length; i++) {
      let conn = network2.selfconns[i];
      let data = {
        weight: conn.weight,
        from: (conn.from as any).index,
        to: (conn.to as any).index,
        gater: conn.gater != null ? (conn.gater as any).index : -1
      };
      n2conns[Connection.innovationID(data.from, data.to)] = data;
    }

    // Split common conn genes from disjoint or excess conn genes
    var connections = [];
    var keys1 = Object.keys(n1conns) as unknown as number[];
    var keys2 = Object.keys(n2conns) as unknown as number[];
    for (i = keys1.length - 1; i >= 0; i--) {
      // Common gene
      if (typeof n2conns[keys1[i]] !== 'undefined') {
        let conn = Math.random() >= 0.5 ? n1conns[keys1[i]] : n2conns[keys1[i]];
        connections.push(conn);

        // Because deleting is expensive, just set it to some value
        n2conns[keys1[i]] = undefined;
      } else if (score1 >= score2 || equal) {
        connections.push(n1conns[keys1[i]]);
      }
    }

    // Excess/disjoint gene
    if (score2 >= score1 || equal) {
      for (i = 0; i < keys2.length; i++) {
        if (typeof n2conns[keys2[i]] !== 'undefined') {
          connections.push(n2conns[keys2[i]]);
        }
      }
    }

    // Add common conn genes uniformly
    for (i = 0; i < connections.length; i++) {
      let connData = connections[i];
      if (connData.to < size && connData.from < size) {
        let from = offspring.nodes[connData.from];
        let to = offspring.nodes[connData.to];
        let conn = offspring.connect(from, to)[0];

        conn.weight = connData.weight;

        if (connData.gater !== -1 && connData.gater < size) {
          offspring.gate(offspring.nodes[connData.gater], conn);
        }
      }
    }

    return offspring;
  }
}
