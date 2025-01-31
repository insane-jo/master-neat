"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var connection_1 = __importDefault(require("./connection"));
var node_1 = __importDefault(require("./node"));
/* Import */
var multi = __importStar(require("../multithreading/multi"));
var methods_1 = __importDefault(require("../methods/methods"));
var config_1 = __importDefault(require("../config"));
var neat_1 = __importDefault(require("../helpers/neat"));
var node_type_enum_1 = require("../types/node-type-enum");
var sub_node_1 = __importDefault(require("../methods/mutation/sub-node"));
var Network = /** @class */ (function () {
    function Network(input, output) {
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
        this.isEvolvingStopped = false;
        // Regularization
        this.dropout = 0;
        // Create input and output nodes
        for (var i = 0; i < this.input + this.output; i++) {
            var type = i < this.input ? node_type_enum_1.NodeTypeEnum.input : node_type_enum_1.NodeTypeEnum.output;
            this.nodes.push(new node_1.default(type));
        }
        // Connect input nodes with output nodes directly
        for (var i = 0; i < this.input; i++) {
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
    Network.prototype.activate = function (input, training) {
        var output = [];
        // Activate nodes chronologically
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].type === node_type_enum_1.NodeTypeEnum.input) {
                this.nodes[i].activate(input[i]);
            }
            else if (this.nodes[i].type === node_type_enum_1.NodeTypeEnum.output) {
                var activation = this.nodes[i].activate();
                output.push(activation);
            }
            else {
                if (training)
                    this.nodes[i].mask = Math.random() < this.dropout ? 0 : 1;
                this.nodes[i].activate();
            }
        }
        return output;
    };
    /**
     * Activates the network without calculating elegibility traces and such
     */
    Network.prototype.noTraceActivate = function (input) {
        var output = [];
        var inputType = node_type_enum_1.NodeTypeEnum.input, outputType = node_type_enum_1.NodeTypeEnum.output;
        var nodes = this.nodes;
        // Activate nodes chronologically
        for (var i = 0, l = nodes.length; i < l; i++) {
            var currNode = nodes[i];
            var currNodeType = currNode.type;
            if (currNodeType === inputType) {
                currNode.noTraceActivate(input[i]);
            }
            else if (currNodeType === outputType) {
                var activation = currNode.noTraceActivate();
                output.push(activation);
            }
            else {
                currNode.noTraceActivate();
            }
        }
        return output;
    };
    /**
     * Backpropagate the network
     */
    Network.prototype.propagate = function (rate, momentum, update, target) {
        if (typeof target === 'undefined' || target.length !== this.output) {
            throw new Error('Output target length should match network output length');
        }
        var targetIndex = target.length;
        // Propagate output nodes
        for (var i = this.nodes.length - 1, nl = this.nodes.length; i >= nl - this.output; i--) {
            this.nodes[i].propagate(rate, momentum, update, target[--targetIndex]);
        }
        // Propagate hidden and input nodes
        for (var i = this.nodes.length - this.output - 1; i >= this.input; i--) {
            this.nodes[i].propagate(rate, momentum, update);
        }
    };
    /**
     * Clear the context of the network
     */
    Network.prototype.clear = function () {
        for (var i = 0, nl = this.nodes.length; i < nl; i++) {
            this.nodes[i].clear();
        }
    };
    /**
     * Connects the from node to the to node
     */
    Network.prototype.connect = function (from, to, weight) {
        var connections = from.connect(to, weight);
        for (var i = 0, cl = connections.length; i < cl; i++) {
            var connection = connections[i];
            if (from !== to) {
                this.connections.push(connection);
            }
            else {
                this.selfconns.push(connection);
            }
        }
        return connections;
    };
    /**
     * Disconnects the from node from the to node
     */
    Network.prototype.disconnect = function (from, to) {
        // Delete the connection in the network's connection array
        var connections = from === to ? this.selfconns : this.connections;
        for (var i = 0, cl = connections.length; i < cl; i++) {
            var connection = connections[i];
            if (connection.from === from && connection.to === to) {
                if (connection.gater !== null)
                    this.ungate(connection);
                connections.splice(i, 1);
                break;
            }
        }
        // Delete the connection at the sending and receiving neuron
        from.disconnect(to);
    };
    /**
     * Gate a connection with a node
     */
    Network.prototype.gate = function (node, connection) {
        if (this.nodes.indexOf(node) === -1) {
            throw new Error('This node is not part of the network!');
        }
        else if (connection.gater != null) {
            if (config_1.default.warnings)
                console.warn('This connection is already gated!');
            return;
        }
        node.gate(connection);
        this.gates.push(connection);
    };
    /**
     *  Remove the gate of a connection
     */
    Network.prototype.ungate = function (connection) {
        var _a;
        var index = this.gates.indexOf(connection);
        if (index === -1) {
            throw new Error('This connection is not gated!');
        }
        this.gates.splice(index, 1);
        (_a = connection.gater) === null || _a === void 0 ? void 0 : _a.ungate(connection);
    };
    /**
     *  Removes a node from the network
     */
    Network.prototype.remove = function (node) {
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
            var connection = node.connections.in[i];
            if (sub_node_1.default.keep_gates && connection.gater !== null && connection.gater !== node) {
                gaters.push(connection.gater);
            }
            inputs.push(connection.from);
            this.disconnect(connection.from, node);
        }
        // Get all its outputing nodes
        var outputs = [];
        for (var i = node.connections.out.length - 1; i >= 0; i--) {
            var connection = node.connections.out[i];
            if (sub_node_1.default.keep_gates && connection.gater !== null && connection.gater !== node) {
                gaters.push(connection.gater);
            }
            outputs.push(connection.to);
            this.disconnect(node, connection.to);
        }
        // Connect the input nodes to the output nodes (if not already connected)
        var connections = [];
        for (var i = 0, il = inputs.length; i < il; i++) {
            var input = inputs[i];
            for (var j = 0, ol = outputs.length; j < ol; j++) {
                var output = outputs[j];
                if (!input.isProjectingTo(output)) {
                    var conn = this.connect(input, output);
                    connections.push(conn[0]);
                }
            }
        }
        // Gate random connections with gaters
        for (var i = 0, gl = gaters.length; i < gl; i++) {
            if (connections.length === 0)
                break;
            var gater = gaters[i];
            var connIndex = Math.floor(Math.random() * connections.length);
            this.gate(gater, connections[connIndex]);
            connections.splice(connIndex, 1);
        }
        // Remove gated connections gated by this node
        for (var i = node.connections.gated.length - 1; i >= 0; i--) {
            var conn_1 = node.connections.gated[i];
            this.ungate(conn_1);
        }
        // Remove selfconnection
        this.disconnect(node, node);
        // Remove the node from this.nodes
        this.nodes.splice(index, 1);
    };
    /**
     * Mutates the network with the given method
     */
    Network.prototype.mutate = function (method) {
        if (typeof method === 'undefined') {
            throw new Error('No (correct) mutate method given!');
        }
        method.callback(this);
    };
    /**
     * Train the given set to this network
     */
    Network.prototype.train = function (set, options) {
        if (options === void 0) { options = {}; }
        if (set[0].input.length !== this.input || set[0].output.length !== this.output) {
            throw new Error('Dataset input/output size should be same as network input/output size!');
        }
        // Warning messages
        if (typeof options.rate === 'undefined') {
            if (config_1.default.warnings)
                console.warn('Using default learning rate, please define a rate!');
        }
        if (typeof options.iterations === 'undefined') {
            if (config_1.default.warnings)
                console.warn('No target iterations given, running until error is reached!');
        }
        // Read the options
        var targetError = options.error || 0.05;
        var cost = options.cost || methods_1.default.cost.MSE;
        var baseRate = options.rate || 0.3;
        var dropout = options.dropout || 0;
        var momentum = options.momentum || 0;
        var batchSize = options.batchSize || 1; // online learning
        var ratePolicy = options.ratePolicy || methods_1.default.rate.FIXED();
        var start = Date.now();
        if (batchSize > set.length) {
            throw new Error('Batch size must be smaller or equal to dataset length!');
        }
        else if (typeof options.iterations === 'undefined' && typeof options.error === 'undefined') {
            throw new Error('At least one of the following options must be specified: error, iterations');
        }
        else if (typeof options.error === 'undefined') {
            targetError = -1; // run until iterations
        }
        else if (typeof options.iterations === 'undefined') {
            options.iterations = 0; // run until target error
        }
        // Save to network
        this.dropout = dropout;
        var trainSet = [], testSet = [];
        if (options.crossValidate) {
            var numTrain = Math.ceil((1 - options.crossValidate.testSize) * set.length);
            trainSet = set.slice(0, numTrain);
            testSet = set.slice(numTrain);
        }
        // Loops the training process
        var currentRate = baseRate;
        var iteration = 0;
        var error = 1;
        // var i, j, x;
        while (error > targetError && (options.iterations === 0 || iteration < options.iterations)) {
            if (options.crossValidate && error <= options.crossValidate.testError)
                break;
            iteration++;
            // Update the rate
            currentRate = ratePolicy(baseRate, iteration);
            // Checks if cross validation is enabled
            if (options.crossValidate) {
                this._trainSet(trainSet, batchSize, currentRate, momentum, cost);
                if (options.clear)
                    this.clear();
                error = this.test(testSet, cost).error;
                if (options.clear)
                    this.clear();
            }
            else {
                error = this._trainSet(set, batchSize, currentRate, momentum, cost);
                if (options.clear)
                    this.clear();
            }
            // Checks for options such as scheduled logs and shuffling
            if (options.shuffle) {
                for (var j = void 0, x = void 0, i = set.length; i; j = Math.floor(Math.random() * i), x = set[--i], set[i] = set[j], set[j] = x)
                    ;
            }
            if (options.log && iteration % options.log === 0) {
                console.log('iteration', iteration, 'error', error, 'rate', currentRate);
            }
            if (options.schedule && iteration % options.schedule.iterations === 0) {
                options.schedule.function({ error: error, iteration: iteration });
            }
        }
        if (options.clear)
            this.clear();
        if (dropout) {
            for (var i = 0, nl = this.nodes.length; i < nl; i++) {
                if (this.nodes[i].type === node_type_enum_1.NodeTypeEnum.hidden || this.nodes[i].type === node_type_enum_1.NodeTypeEnum.constant) {
                    this.nodes[i].mask = 1 - this.dropout;
                }
            }
        }
        return {
            error: error,
            iterations: iteration,
            time: Date.now() - start
        };
    };
    /**
     * Performs one training epoch and returns the error
     * private function used in this.train
     */
    Network.prototype._trainSet = function (set, batchSize, currentRate, momentum, costFunction) {
        var errorSum = 0;
        for (var i = 0, sl = set.length; i < sl; i++) {
            var input = set[i].input;
            var target = set[i].output;
            var update = ((i + 1) % batchSize === 0 || (i + 1) === set.length);
            var output = this.activate(input, true);
            this.propagate(currentRate, momentum, update, target);
            errorSum += costFunction(target, output);
        }
        return errorSum / set.length;
    };
    /**
     * Tests a set and returns the error and elapsed time
     */
    Network.prototype.test = function (set, cost) {
        if (cost === void 0) { cost = methods_1.default.cost.MSE; }
        var nodes = this.nodes;
        var dropout = this.dropout;
        // Set the correct mask for dropout in a single loop if enabled
        if (dropout) {
            var maskValue = 1 - dropout;
            for (var i = 0, nl = nodes.length; i < nl; i++) {
                var node = nodes[i];
                if (node.type === node_type_enum_1.NodeTypeEnum.hidden || node.type === node_type_enum_1.NodeTypeEnum.constant) {
                    node.mask = maskValue;
                }
            }
        }
        var totalError = 0;
        var setLength = set.length;
        var startTime = Date.now();
        // Compute error in a single loop
        for (var i = 0; i < setLength; i++) {
            var _a = set[i], input = _a.input, target = _a.output;
            var output = this.noTraceActivate(input);
            totalError += cost(target, output);
        }
        var averageError = totalError / setLength;
        return {
            error: averageError,
            time: Date.now() - startTime
        };
    };
    /**
     * Convert the network to a json object
     */
    Network.prototype.toJSON = function () {
        var json = {
            nodes: [],
            connections: [],
            input: this.input,
            output: this.output,
            dropout: this.dropout
        };
        // So we don't have to use expensive .indexOf()
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].index = i;
        }
        for (var i = 0; i < this.nodes.length; i++) {
            var node = this.nodes[i];
            var tojson = node.toJSON();
            tojson.index = i;
            json.nodes.push(tojson);
            if (node.connections.self.weight !== 0) {
                var tojson_1 = node.connections.self.toJSON();
                tojson_1.from = i;
                tojson_1.to = i;
                tojson_1.gater = node.connections.self.gater != null ? node.connections.self.gater.index : null;
                json.connections.push(tojson_1);
            }
        }
        for (var i = 0; i < this.connections.length; i++) {
            var conn = this.connections[i];
            var tojson = conn.toJSON();
            tojson.from = conn.from.index;
            tojson.to = conn.to.index;
            tojson.gater = conn.gater != null ? conn.gater.index : null;
            json.connections.push(tojson);
        }
        return json;
    };
    /**
     * Sets the value of a property for every node in this network
     */
    Network.prototype.set = function (values) {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].bias = values.bias || this.nodes[i].bias;
            this.nodes[i].squash = values.squash || this.nodes[i].squash;
        }
    };
    Network.prototype.stopEvolve = function () {
        this.isEvolvingStopped = true;
        return this.evolvingPromise;
    };
    /**
     * Evolves the network to reach a lower error on a dataset
     */
    Network.prototype.evolve = function (set, options) {
        return __awaiter(this, void 0, void 0, function () {
            var resolveEvolve, targetError, growth, cost, amount, threads, start, fitnessFunction, workers, i_1, i_2, neat, error, bestFitness, bestGenome, fittest, fitness, i, returnResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (set[0].input.length !== this.input || set[0].output.length !== this.output) {
                            throw new Error('Dataset input/output size should be same as network input/output size!');
                        }
                        this.isEvolvingStopped = false;
                        this.evolvingPromise = new Promise(function (resolve) {
                            resolveEvolve = resolve;
                        });
                        // Read the options
                        options = options || {};
                        targetError = typeof options.error !== 'undefined' ? options.error : 0.05;
                        growth = typeof options.growth !== 'undefined' ? options.growth : 0.0001;
                        cost = options.cost || methods_1.default.cost.MSE;
                        amount = options.amount || 1;
                        threads = options.threads;
                        if (typeof threads === 'undefined') {
                            if (typeof window === 'undefined') { // Node.js
                                threads = require('os').cpus().length;
                            }
                            else { // Browser
                                threads = navigator.hardwareConcurrency;
                            }
                        }
                        start = Date.now();
                        if (typeof options.iterations === 'undefined' && typeof options.error === 'undefined') {
                            throw new Error('At least one of the following options must be specified: error, iterations');
                        }
                        else if (typeof options.error === 'undefined') {
                            targetError = -1; // run until iterations
                        }
                        else if (typeof options.iterations === 'undefined') {
                            options.iterations = 0; // run until target error
                        }
                        workers = [];
                        if (typeof window !== 'undefined' && options.browserWorkerScriptUrl == undefined) {
                            threads = 1;
                        }
                        if (threads === 1) {
                            // Create the fitness function
                            fitnessFunction = function (genome) {
                                var score = 0;
                                for (var i = 0; i < amount; i++) {
                                    score -= genome.test(set, cost).error;
                                }
                                score -= (genome.nodes.length - genome.input - genome.output + genome.connections.length + genome.gates.length) * growth;
                                score = isNaN(score) ? -Infinity : score; // this can cause problems with fitness proportionate selection
                                return score / amount;
                            };
                        }
                        else {
                            // Create workers, send datasets
                            workers = [];
                            if (typeof window === 'undefined') {
                                for (i_1 = 0; i_1 < threads; i_1++) {
                                    workers.push(new multi.workers.node.TestWorker(set, cost));
                                }
                            }
                            else {
                                for (i_2 = 0; i_2 < threads; i_2++) {
                                    workers.push(new multi.workers.browser.TestWorker(options.browserWorkerScriptUrl, set, cost));
                                }
                            }
                            fitnessFunction = function (population) {
                                return new Promise(function (resolve) {
                                    // Create a queue
                                    var queue = population.slice();
                                    var done = 0;
                                    // Start worker function
                                    var startWorker = function (worker) {
                                        if (!queue.length) {
                                            if (++done === threads)
                                                resolve(undefined);
                                            return;
                                        }
                                        var genome = queue.shift();
                                        worker.evaluate(genome).then(function (result) {
                                            genome.score = -result;
                                            genome.score -= (genome.nodes.length - genome.input - genome.output +
                                                genome.connections.length + genome.gates.length) * growth;
                                            genome.score = isNaN(parseFloat(result)) ? -Infinity : genome.score;
                                            startWorker(worker);
                                        });
                                    };
                                    for (var i = 0; i < workers.length; i++) {
                                        startWorker(workers[i]);
                                    }
                                });
                            };
                            options.fitnessPopulation = true;
                        }
                        // Intialise the NEAT instance
                        options.network = this;
                        neat = new neat_1.default(this.input, this.output, fitnessFunction, options);
                        error = -Infinity;
                        bestFitness = -Infinity;
                        _a.label = 1;
                    case 1:
                        if (!(!this.isEvolvingStopped && error < -targetError && (options.iterations === 0 || neat.generation < options.iterations))) return [3 /*break*/, 3];
                        return [4 /*yield*/, neat.evolve()];
                    case 2:
                        fittest = _a.sent();
                        fitness = fittest.score;
                        error = fitness + (fittest.nodes.length - fittest.input - fittest.output + fittest.connections.length + fittest.gates.length) * growth;
                        if (fitness > bestFitness) {
                            bestFitness = fitness;
                            bestGenome = fittest;
                        }
                        if (options.log && neat.generation % options.log === 0) {
                            console.log('iteration', neat.generation, 'fitness', fitness, 'error', -error);
                        }
                        if (options.schedule && neat.generation % options.schedule.iterations === 0) {
                            options.schedule.function({ fitness: fitness, error: -error, iteration: neat.generation });
                        }
                        if (options.callback) {
                            options.callback(fittest, { fitness: fitness, error: -error, iteration: neat.generation });
                        }
                        return [3 /*break*/, 1];
                    case 3:
                        if (threads > 1) {
                            //@ts-ignore
                            for (i = 0; i < workers.length; i++) {
                                //@ts-ignore
                                workers[i].terminate();
                            }
                        }
                        if (typeof bestGenome !== 'undefined') {
                            this.nodes = bestGenome.nodes;
                            this.connections = bestGenome.connections;
                            this.selfconns = bestGenome.selfconns;
                            this.gates = bestGenome.gates;
                            if (options.clear)
                                this.clear();
                        }
                        returnResult = {
                            error: -error,
                            iterations: neat.generation,
                            time: Date.now() - start
                        };
                        resolveEvolve(returnResult);
                        return [2 /*return*/, returnResult];
                }
            });
        });
    };
    /**
     * Creates a standalone function of the network which can be run without the
     * need of a library
     */
    Network.prototype.standalone = function () {
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
            this.nodes[i].index = i;
        }
        for (i = this.input; i < this.nodes.length; i++) {
            var node_2 = this.nodes[i];
            activations.push(node_2.activation);
            states.push(node_2.state);
            var functionIndex = present.indexOf(node_2.squash.name);
            if (functionIndex === -1) {
                functionIndex = present.length;
                present.push(node_2.squash.name);
                functions.push(node_2.squash.toString());
            }
            var incoming = [];
            for (var j = 0; j < node_2.connections.in.length; j++) {
                var conn = node_2.connections.in[j];
                var computation = "A[".concat(conn.from.index, "] * ").concat(conn.weight);
                if (conn.gater != null) {
                    computation += " * A[".concat(conn.gater.index, "]");
                }
                incoming.push(computation);
            }
            if (node_2.connections.self.weight) {
                var conn_2 = node_2.connections.self;
                var computation_1 = "S[".concat(i, "] * ").concat(conn_2.weight);
                if (conn_2.gater != null) {
                    computation_1 += " * A[".concat(conn_2.gater.index, "]");
                }
                incoming.push(computation_1);
            }
            var line1 = "S[".concat(i, "] = ").concat(incoming.join(' + '), " + ").concat(node_2.bias, ";");
            var line2 = "A[".concat(i, "] = F[").concat(functionIndex, "](S[").concat(i, "])").concat(!node_2.mask ? ' * ' + node_2.mask : '', ";");
            lines.push(line1);
            lines.push(line2);
        }
        var output = [];
        for (i = this.nodes.length - this.output; i < this.nodes.length; i++) {
            output.push("A[".concat(i, "]"));
        }
        lines.push("return [".concat(output.join(','), "];"));
        var total = '';
        total += "var F = [".concat(functions.toString(), "];\r\n");
        total += "var A = [".concat(activations.toString(), "];\r\n");
        total += "var S = [".concat(states.toString(), "];\r\n");
        total += "activate = function(input){\r\n".concat(lines.join('\r\n'), "\r\n}");
        return total;
    };
    /**
     * Serialize to send to workers efficiently
     */
    Network.prototype.serialize = function () {
        var activations = [];
        var states = [];
        var conns = [];
        var squashes = [
            'LOGISTIC', 'TANH', 'IDENTITY', 'STEP', 'RELU', 'SOFTSIGN', 'SINUSOID',
            'GAUSSIAN', 'BENT_IDENTITY', 'BIPOLAR', 'BIPOLAR_SIGMOID', 'HARD_TANH',
            'ABSOLUTE', 'INVERSE', 'SELU'
        ];
        conns.push(this.input);
        conns.push(this.output);
        var i;
        for (i = 0; i < this.nodes.length; i++) {
            var node = this.nodes[i];
            node.index = i;
            activations.push(node.activation);
            states.push(node.state);
        }
        for (i = this.input; i < this.nodes.length; i++) {
            var node = this.nodes[i];
            conns.push(node.index);
            conns.push(node.bias);
            conns.push(squashes.indexOf(node.squash.name));
            conns.push(node.connections.self.weight);
            conns.push(node.connections.self.gater == null ? -1 : node.connections.self.gater.index);
            for (var j = 0; j < node.connections.in.length; j++) {
                var conn = node.connections.in[j];
                conns.push(conn.from.index);
                conns.push(conn.weight);
                conns.push(conn.gater == null ? -1 : conn.gater.index);
            }
            conns.push(-2); // stop token -> next node
        }
        return [activations, states, conns];
    };
    /**
     * Convert a json object to a network
     */
    Network.fromJSON = function (json) {
        var network = new Network(json.input, json.output);
        network.dropout = json.dropout;
        network.nodes = [];
        network.connections = [];
        var i;
        for (i = 0; i < json.nodes.length; i++) {
            network.nodes.push(node_1.default.fromJSON(json.nodes[i]));
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
    };
    /**
     * Merge two networks into one
     */
    Network.merge = function (network1, network2) {
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
            var conn = network2.connections[i];
            if (conn.from.type === node_type_enum_1.NodeTypeEnum.input) {
                var index = network2.nodes.indexOf(conn.from);
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
            network1.nodes[i].type = node_type_enum_1.NodeTypeEnum.hidden;
        }
        // Create one network from both networks
        network1.connections = network1.connections.concat(network2.connections);
        network1.nodes = network1.nodes.concat(network2.nodes);
        return network1;
    };
    /**
     * Create an offspring from two parent networks
     */
    Network.crossOver = function (network1, network2, equal) {
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
            var max = Math.max(network1.nodes.length, network2.nodes.length);
            var min = Math.min(network1.nodes.length, network2.nodes.length);
            size = Math.floor(Math.random() * (max - min + 1) + min);
        }
        else if (score1 > score2) {
            size = network1.nodes.length;
        }
        else {
            size = network2.nodes.length;
        }
        // Rename some variables for easier reading
        var outputSize = network1.output;
        // Set indexes so we don't need indexOf
        var i;
        for (i = 0; i < network1.nodes.length; i++) {
            network1.nodes[i].index = i;
        }
        for (i = 0; i < network2.nodes.length; i++) {
            network2.nodes[i].index = i;
        }
        // Assign nodes from parents to offspring
        for (i = 0; i < size; i++) {
            // Determine if an output node is needed
            var node;
            if (i < size - outputSize) {
                var random = Math.random();
                node = random >= 0.5 ? network1.nodes[i] : network2.nodes[i];
                var other = random < 0.5 ? network1.nodes[i] : network2.nodes[i];
                if (typeof node === 'undefined' || node.type === node_type_enum_1.NodeTypeEnum.output) {
                    node = other;
                }
            }
            else {
                if (Math.random() >= 0.5) {
                    node = network1.nodes[network1.nodes.length + i - size];
                }
                else {
                    node = network2.nodes[network2.nodes.length + i - size];
                }
            }
            var newNode = new node_1.default();
            newNode.bias = node.bias;
            newNode.squash = node.squash;
            newNode.type = node.type;
            offspring.nodes.push(newNode);
        }
        // Create arrays of connection genes
        var n1conns = {};
        var n2conns = {};
        // Normal connections
        for (i = 0; i < network1.connections.length; i++) {
            var conn = network1.connections[i];
            var data = {
                weight: conn.weight,
                from: conn.from.index,
                to: conn.to.index,
                gater: conn.gater != null ? conn.gater.index : -1
            };
            n1conns[connection_1.default.innovationID(data.from, data.to)] = data;
        }
        // Selfconnections
        for (i = 0; i < network1.selfconns.length; i++) {
            var conn = network1.selfconns[i];
            var data = {
                weight: conn.weight,
                from: conn.from.index,
                to: conn.to.index,
                gater: conn.gater != null ? conn.gater.index : -1
            };
            n1conns[connection_1.default.innovationID(data.from, data.to)] = data;
        }
        // Normal connections
        for (i = 0; i < network2.connections.length; i++) {
            var conn = network2.connections[i];
            var data = {
                weight: conn.weight,
                from: conn.from.index,
                to: conn.to.index,
                gater: conn.gater != null ? conn.gater.index : -1
            };
            n2conns[connection_1.default.innovationID(data.from, data.to)] = data;
        }
        // Selfconnections
        for (i = 0; i < network2.selfconns.length; i++) {
            var conn = network2.selfconns[i];
            var data = {
                weight: conn.weight,
                from: conn.from.index,
                to: conn.to.index,
                gater: conn.gater != null ? conn.gater.index : -1
            };
            n2conns[connection_1.default.innovationID(data.from, data.to)] = data;
        }
        // Split common conn genes from disjoint or excess conn genes
        var connections = [];
        var keys1 = Object.keys(n1conns);
        var keys2 = Object.keys(n2conns);
        for (i = keys1.length - 1; i >= 0; i--) {
            // Common gene
            if (typeof n2conns[keys1[i]] !== 'undefined') {
                var conn = Math.random() >= 0.5 ? n1conns[keys1[i]] : n2conns[keys1[i]];
                connections.push(conn);
                // Because deleting is expensive, just set it to some value
                n2conns[keys1[i]] = undefined;
            }
            else if (score1 >= score2 || equal) {
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
            var connData = connections[i];
            if (connData.to < size && connData.from < size) {
                var from = offspring.nodes[connData.from];
                var to = offspring.nodes[connData.to];
                var conn = offspring.connect(from, to)[0];
                conn.weight = connData.weight;
                if (connData.gater !== -1 && connData.gater < size) {
                    offspring.gate(offspring.nodes[connData.gater], conn);
                }
            }
        }
        return offspring;
    };
    return Network;
}());
exports.default = Network;
//# sourceMappingURL=network.js.map