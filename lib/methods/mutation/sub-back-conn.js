"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../../config"));
var subBackConn = {
    name: 'SUB_BACK_CONN',
    callback: function (network) {
        // List of possible connections that can be removed
        var possible = [];
        for (var i = 0; i < network.connections.length; i++) {
            var conn = network.connections[i];
            // Check if it is not disabling a node
            if (conn.from.connections.out.length > 1 && conn.to.connections.in.length > 1 && network.nodes.indexOf(conn.from) > network.nodes.indexOf(conn.to)) {
                possible.push(conn);
            }
        }
        if (possible.length === 0) {
            if (config_1.default.warnings)
                console.warn('No connections to remove!');
            return;
        }
        var randomConn = possible[Math.floor(Math.random() * possible.length)];
        network.disconnect(randomConn.from, randomConn.to);
    }
};
exports.default = subBackConn;
//# sourceMappingURL=sub-back-conn.js.map