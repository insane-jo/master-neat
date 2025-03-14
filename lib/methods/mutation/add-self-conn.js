"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../../config"));
var addSelfConn = {
    name: 'ADD_SELF_CONN',
    callback: function (network) {
        // Check which nodes aren't selfconnected yet
        var possible = [];
        for (var i = network.input; i < network.nodes.length; i++) {
            var node_1 = network.nodes[i];
            if (node_1.connections.self.weight === 0) {
                possible.push(node_1);
            }
        }
        if (possible.length === 0) {
            if (config_1.default.warnings)
                console.warn('No more self-connections to add!');
            return;
        }
        // Select a random node
        var node = possible[Math.floor(Math.random() * possible.length)];
        // Connect it to himself
        network.connect(node, node);
    }
};
exports.default = addSelfConn;
//# sourceMappingURL=add-self-conn.js.map