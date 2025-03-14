"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Import */
var methods_1 = __importDefault(require("../methods/methods"));
var network_1 = __importDefault(require("../architecture/network"));
var layer_1 = __importDefault(require("../architecture/layer"));
var group_1 = __importDefault(require("../architecture/group"));
var node_1 = __importDefault(require("../architecture/node"));
var node_type_enum_1 = require("../types/node-type-enum");
var add_node_1 = __importDefault(require("../methods/mutation/add-node"));
var add_conn_1 = __importDefault(require("../methods/mutation/add-conn"));
var add_back_conn_1 = __importDefault(require("../methods/mutation/add-back-conn"));
var add_self_conn_1 = __importDefault(require("../methods/mutation/add-self-conn"));
var add_gate_1 = __importDefault(require("../methods/mutation/add-gate"));
/*******************************************************************************
                                        architect
*******************************************************************************/
var architect = {
    /**
     * Constructs a network from a given array of connected nodes
     */
    Construct: function (list) {
        // Create a network
        var network = new network_1.default(0, 0);
        // Transform all groups into nodes
        var nodes = [];
        var i;
        for (i = 0; i < list.length; i++) {
            var j = void 0;
            if (list[i] instanceof group_1.default) {
                for (j = 0; j < list[i].nodes.length; j++) {
                    nodes.push(list[i].nodes[j]);
                }
            }
            else if (list[i] instanceof layer_1.default) {
                for (j = 0; j < list[i].nodes.length; j++) {
                    for (var k = 0; k < list[i].nodes[j].nodes.length; k++) {
                        nodes.push(list[i].nodes[j].nodes[k]);
                    }
                }
            }
            else if (list[i] instanceof node_1.default) {
                nodes.push(list[i]);
            }
        }
        // Determine input and output nodes
        var inputs = [];
        var outputs = [];
        for (i = nodes.length - 1; i >= 0; i--) {
            if (nodes[i].type === node_type_enum_1.NodeTypeEnum.output || nodes[i].connections.out.length + nodes[i].connections.gated.length === 0) {
                nodes[i].type = node_type_enum_1.NodeTypeEnum.output;
                network.output++;
                outputs.push(nodes[i]);
                nodes.splice(i, 1);
            }
            else if (nodes[i].type === node_type_enum_1.NodeTypeEnum.input || !nodes[i].connections.in.length) {
                nodes[i].type = node_type_enum_1.NodeTypeEnum.input;
                network.input++;
                inputs.push(nodes[i]);
                nodes.splice(i, 1);
            }
        }
        // Input nodes are always first, output nodes are always last
        nodes = inputs.concat(nodes).concat(outputs);
        if (network.input === 0 || network.output === 0) {
            throw new Error('Given nodes have no clear input/output node!');
        }
        for (i = 0; i < nodes.length; i++) {
            var j = void 0;
            for (j = 0; j < nodes[i].connections.out.length; j++) {
                network.connections.push(nodes[i].connections.out[j]);
            }
            for (j = 0; j < nodes[i].connections.gated.length; j++) {
                network.gates.push(nodes[i].connections.gated[j]);
            }
            if (nodes[i].connections.self.weight !== 0) {
                network.selfconns.push(nodes[i].connections.self);
            }
        }
        network.nodes = nodes;
        return network;
    },
    /**
     * Creates a multilayer perceptron (MLP)
     */
    Perceptron: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // Convert arguments to Array
        var layers = Array.prototype.slice.call(args);
        if (layers.length < 3) {
            throw new Error('You have to specify at least 3 layers');
        }
        // Create a list of nodes/groups
        var nodes = [];
        nodes.push(new group_1.default(layers[0]));
        for (var i = 1; i < layers.length; i++) {
            var layer = layers[i];
            layer = new group_1.default(layer);
            nodes.push(layer);
            nodes[i - 1].connect(nodes[i], methods_1.default.connection.ALL_TO_ALL);
        }
        // Construct the network
        return architect.Construct(nodes);
    },
    /**
     * Creates a randomly connected network
     */
    Random: function (input, hidden, output, options) {
        options = options || {};
        var connections = options.connections || hidden * 2;
        var backconnections = options.backconnections || 0;
        var selfconnections = options.selfconnections || 0;
        var gates = options.gates || 0;
        var network = new network_1.default(input, output);
        var i;
        for (i = 0; i < hidden; i++) {
            network.mutate(add_node_1.default);
        }
        for (i = 0; i < connections - hidden; i++) {
            network.mutate(add_conn_1.default);
        }
        for (i = 0; i < backconnections; i++) {
            network.mutate(add_back_conn_1.default);
        }
        for (i = 0; i < selfconnections; i++) {
            network.mutate(add_self_conn_1.default);
        }
        for (i = 0; i < gates; i++) {
            network.mutate(add_gate_1.default);
        }
        return network;
    },
    /**
     * Creates a long short-term memory network
     */
    LSTM: function () {
        var inArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inArgs[_i] = arguments[_i];
        }
        var args = Array.prototype.slice.call(inArgs);
        if (args.length < 3) {
            throw new Error('You have to specify at least 3 layers');
        }
        var last = args.pop();
        var outputLayer;
        if (typeof last === 'number') {
            outputLayer = new group_1.default(last);
            last = {};
        }
        else {
            outputLayer = new group_1.default(args.pop()); // last argument
        }
        outputLayer.set({
            type: node_type_enum_1.NodeTypeEnum.output
        });
        var options = {
            memoryToMemory: last.memoryToMemory || false,
            outputToMemory: last.outputToMemory || false,
            outputToGates: last.outputToGates || false,
            inputToOutput: last.inputToOutput === undefined ? true : last.inputToOutput,
            inputToDeep: last.inputToDeep === undefined ? true : last.inputToDeep
        };
        var inputLayer = new group_1.default(args.shift()); // first argument
        inputLayer.set({
            type: node_type_enum_1.NodeTypeEnum.input
        });
        var blocks = args; // all the arguments in the middle
        var nodes = [];
        nodes.push(inputLayer);
        var previous = inputLayer;
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            // Init required nodes (in activation order)
            var inputGate = new group_1.default(block);
            var forgetGate = new group_1.default(block);
            var memoryCell = new group_1.default(block);
            var outputGate = new group_1.default(block);
            var outputBlock = i === blocks.length - 1 ? outputLayer : new group_1.default(block);
            inputGate.set({
                bias: 1
            });
            forgetGate.set({
                bias: 1
            });
            outputGate.set({
                bias: 1
            });
            // Connect the input with all the nodes
            var input = previous.connect(memoryCell, methods_1.default.connection.ALL_TO_ALL);
            previous.connect(inputGate, methods_1.default.connection.ALL_TO_ALL);
            previous.connect(outputGate, methods_1.default.connection.ALL_TO_ALL);
            previous.connect(forgetGate, methods_1.default.connection.ALL_TO_ALL);
            // Set up internal connections
            memoryCell.connect(inputGate, methods_1.default.connection.ALL_TO_ALL);
            memoryCell.connect(forgetGate, methods_1.default.connection.ALL_TO_ALL);
            memoryCell.connect(outputGate, methods_1.default.connection.ALL_TO_ALL);
            var forget = memoryCell.connect(memoryCell, methods_1.default.connection.ONE_TO_ONE);
            var output = memoryCell.connect(outputBlock, methods_1.default.connection.ALL_TO_ALL);
            // Set up gates
            inputGate.gate(input, methods_1.default.gating.INPUT);
            forgetGate.gate(forget, methods_1.default.gating.SELF);
            outputGate.gate(output, methods_1.default.gating.OUTPUT);
            // Input to all memory cells
            if (options.inputToDeep && i > 0) {
                var input_1 = inputLayer.connect(memoryCell, methods_1.default.connection.ALL_TO_ALL);
                inputGate.gate(input_1, methods_1.default.gating.INPUT);
            }
            // Optional connections
            if (options.memoryToMemory) {
                var input_2 = memoryCell.connect(memoryCell, methods_1.default.connection.ALL_TO_ELSE);
                inputGate.gate(input_2, methods_1.default.gating.INPUT);
            }
            if (options.outputToMemory) {
                var input_3 = outputLayer.connect(memoryCell, methods_1.default.connection.ALL_TO_ALL);
                inputGate.gate(input_3, methods_1.default.gating.INPUT);
            }
            if (options.outputToGates) {
                outputLayer.connect(inputGate, methods_1.default.connection.ALL_TO_ALL);
                outputLayer.connect(forgetGate, methods_1.default.connection.ALL_TO_ALL);
                outputLayer.connect(outputGate, methods_1.default.connection.ALL_TO_ALL);
            }
            // Add to array
            nodes.push(inputGate);
            nodes.push(forgetGate);
            nodes.push(memoryCell);
            nodes.push(outputGate);
            if (i !== blocks.length - 1)
                nodes.push(outputBlock);
            previous = outputBlock;
        }
        // input to output direct connection
        if (options.inputToOutput) {
            inputLayer.connect(outputLayer, methods_1.default.connection.ALL_TO_ALL);
        }
        nodes.push(outputLayer);
        return architect.Construct(nodes);
    },
    /**
     * Creates a gated recurrent unit network
     */
    GRU: function () {
        var inArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inArgs[_i] = arguments[_i];
        }
        var args = Array.prototype.slice.call(inArgs);
        if (args.length < 3) {
            throw new Error('not enough layers (minimum 3) !!');
        }
        var inputLayer = new group_1.default(args.shift()); // first argument
        var outputLayer = new group_1.default(args.pop()); // last argument
        var blocks = args; // all the arguments in the middle
        var nodes = [];
        nodes.push(inputLayer);
        var previous = inputLayer;
        for (var i = 0; i < blocks.length; i++) {
            var layer = layer_1.default.GRU(blocks[i]);
            previous.connect(layer);
            previous = layer;
            nodes.push(layer);
        }
        previous.connect(outputLayer);
        nodes.push(outputLayer);
        return architect.Construct(nodes);
    },
    /**
     * Creates a hopfield network of the given size
     */
    Hopfield: function (size) {
        var input = new group_1.default(size);
        var output = new group_1.default(size);
        input.connect(output, methods_1.default.connection.ALL_TO_ALL);
        input.set({
            type: node_type_enum_1.NodeTypeEnum.input
        });
        output.set({
            squash: methods_1.default.activation.STEP,
            type: node_type_enum_1.NodeTypeEnum.output
        });
        return architect.Construct([input, output]);
    },
    /**
     * Creates a NARX network (remember previous inputs/outputs)
     */
    NARX: function (inputSize, hiddenLayers, outputSize, previousInput, previousOutput) {
        if (!Array.isArray(hiddenLayers)) {
            hiddenLayers = [hiddenLayers];
        }
        var nodes = [];
        var input = layer_1.default.Dense(inputSize);
        var inputMemory = layer_1.default.Memory(inputSize, previousInput);
        var hidden = [];
        var output = layer_1.default.Dense(outputSize);
        var outputMemory = layer_1.default.Memory(outputSize, previousOutput);
        nodes.push(input);
        nodes.push(outputMemory);
        for (var i = 0; i < hiddenLayers.length; i++) {
            var hiddenLayer = layer_1.default.Dense(hiddenLayers[i]);
            hidden.push(hiddenLayer);
            nodes.push(hiddenLayer);
            if (typeof hidden[i - 1] !== 'undefined') {
                hidden[i - 1].connect(hiddenLayer, methods_1.default.connection.ALL_TO_ALL);
            }
        }
        nodes.push(inputMemory);
        nodes.push(output);
        input.connect(hidden[0], methods_1.default.connection.ALL_TO_ALL);
        input.connect(inputMemory, methods_1.default.connection.ONE_TO_ONE, 1);
        inputMemory.connect(hidden[0], methods_1.default.connection.ALL_TO_ALL);
        hidden[hidden.length - 1].connect(output, methods_1.default.connection.ALL_TO_ALL);
        output.connect(outputMemory, methods_1.default.connection.ONE_TO_ONE, 1);
        outputMemory.connect(hidden[0], methods_1.default.connection.ALL_TO_ALL);
        input.set(new node_1.default(node_type_enum_1.NodeTypeEnum.input));
        output.set(new node_1.default(node_type_enum_1.NodeTypeEnum.output));
        return architect.Construct(nodes);
    }
};
exports.default = architect;
//# sourceMappingURL=architect.js.map