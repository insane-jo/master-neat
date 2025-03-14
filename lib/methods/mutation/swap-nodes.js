"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../../config"));
var swapNodes = {
    name: 'SWAP_NODES',
    callback: function (network) {
        // Has no effect on input node, so they are excluded
        if ((this.mutateOutput && network.nodes.length - network.input < 2) ||
            (!this.mutateOutput && network.nodes.length - network.input - network.output < 2)) {
            if (config_1.default.warnings)
                console.warn('No nodes that allow swapping of bias and activation function');
            return;
        }
        var index = Math.floor(Math.random() * (network.nodes.length - (this.mutateOutput ? 0 : network.output) - network.input) + network.input);
        var node1 = network.nodes[index];
        index = Math.floor(Math.random() * (network.nodes.length - (this.mutateOutput ? 0 : network.output) - network.input) + network.input);
        var node2 = network.nodes[index];
        var biasTemp = node1.bias;
        var squashTemp = node1.squash;
        node1.bias = node2.bias;
        node1.squash = node2.squash;
        node2.bias = biasTemp;
        node2.squash = squashTemp;
    },
    mutateOutput: true
};
exports.default = swapNodes;
//# sourceMappingURL=swap-nodes.js.map