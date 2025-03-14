"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../../config"));
var addBackConn = {
    name: 'ADD_BACK_CONN',
    callback: function (network) {
        // Create an array of all uncreated (backfed) connections
        var available = [];
        for (var i = network.input; i < network.nodes.length; i++) {
            var node1 = network.nodes[i];
            for (var j = network.input; j < i; j++) {
                var node2 = network.nodes[j];
                if (!node1.isProjectingTo(node2)) {
                    available.push([node1, node2]);
                }
            }
        }
        if (available.length === 0) {
            if (config_1.default.warnings)
                console.warn('No more connections to be made!');
            return;
        }
        var pair = available[Math.floor(Math.random() * available.length)];
        network.connect(pair[0], pair[1]);
    }
};
exports.default = addBackConn;
//# sourceMappingURL=add-back-conn.js.map