"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("../../architecture/node"));
var node_type_enum_1 = require("../../types/node-type-enum");
var mod_activation_1 = __importDefault(require("./mod-activation"));
var addNode = {
    name: 'ADD_NODE',
    callback: function (network) {
        // Look for an existing connection and place a node in between
        var connection = network.connections[Math.floor(Math.random() * network.connections.length)];
        var gater, from, to;
        if (connection) {
            gater = connection.gater;
            from = connection.from;
            to = connection.to;
            network.disconnect(from, to);
        }
        else {
            from = network.nodes.find(function (node) { return node.type === node_type_enum_1.NodeTypeEnum.input; });
            to = network.nodes.find(function (node) { return node.type === node_type_enum_1.NodeTypeEnum.output; });
        }
        // Insert the new node right before the old connection.to
        var toIndex = network.nodes.indexOf(to);
        var node = new node_1.default(node_type_enum_1.NodeTypeEnum.hidden);
        // Random squash function
        mod_activation_1.default.mutateNode(node);
        // Place it in this.nodes
        var minBound = Math.min(toIndex, network.nodes.length - network.output);
        network.nodes.splice(minBound, 0, node);
        // Now create two new connections
        var newConn1 = network.connect(from, node)[0];
        var newConn2 = network.connect(node, to)[0];
        // Check if the original connection was gated
        if (gater != null) {
            network.gate(gater, Math.random() >= 0.5 ? newConn1 : newConn2);
        }
    }
};
exports.default = addNode;
//# sourceMappingURL=add-node.js.map