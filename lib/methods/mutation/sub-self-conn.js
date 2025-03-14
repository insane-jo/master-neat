"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../../config"));
var subSelfConn = {
    name: 'SUB_SELF_CONN',
    callback: function (network) {
        if (network.selfconns.length === 0) {
            if (config_1.default.warnings)
                console.warn('No more self-connections to remove!');
            return;
        }
        var conn = network.selfconns[Math.floor(Math.random() * network.selfconns.length)];
        network.disconnect(conn.from, conn.to);
    }
};
exports.default = subSelfConn;
//# sourceMappingURL=sub-self-conn.js.map