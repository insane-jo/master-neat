"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var modWeight = {
    name: 'MOD_WEIGHT',
    callback: function (network) {
        var allconnections = network.connections.concat(network.selfconns);
        var connection = allconnections[Math.floor(Math.random() * allconnections.length)];
        if (!connection) {
            return;
        }
        var modification = Math.random() * (this.max - this.min) + this.min;
        connection.weight += modification;
    },
    min: -1,
    max: 1
};
exports.default = modWeight;
//# sourceMappingURL=mod-weight.js.map