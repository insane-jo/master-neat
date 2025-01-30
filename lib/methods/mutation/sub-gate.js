"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../../config"));
var subGate = {
    name: 'SUB_GATE',
    callback: function (network) {
        // Select a random gated connection
        if (network.gates.length === 0) {
            if (config_1.default.warnings)
                console.warn('No more connections to ungate!');
            return;
        }
        var index = Math.floor(Math.random() * network.gates.length);
        var gatedconn = network.gates[index];
        network.ungate(gatedconn);
    }
};
exports.default = subGate;
//# sourceMappingURL=sub-gate.js.map