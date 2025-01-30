"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../../config"));
var subNode = {
    name: 'SUB_NODE',
    callback: function (network) {
        // Check if there are nodes left to remove
        if (network.nodes.length === network.input + network.output) {
            if (config_1.default.warnings)
                console.warn('No more nodes left to remove!');
            return;
        }
        // Select a node which isn't an input or output node
        var index = Math.floor(Math.random() * (network.nodes.length - network.output - network.input) + network.input);
        network.remove(network.nodes[index]);
    },
    keep_gates: true
};
exports.default = subNode;
//# sourceMappingURL=sub-node.js.map