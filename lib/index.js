"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpers = exports.multi = exports.NodeElement = exports.Layer = exports.Group = exports.config = exports.Network = exports.Connection = exports.methods = void 0;
var methods_1 = __importDefault(require("./methods/methods"));
exports.methods = methods_1.default;
var connection_1 = __importDefault(require("./architecture/connection"));
exports.Connection = connection_1.default;
var architect_1 = __importDefault(require("./helpers/architect"));
var network_1 = __importDefault(require("./architecture/network"));
exports.Network = network_1.default;
var config_1 = __importDefault(require("./config"));
exports.config = config_1.default;
var group_1 = __importDefault(require("./architecture/group"));
exports.Group = group_1.default;
var layer_1 = __importDefault(require("./architecture/layer"));
exports.Layer = layer_1.default;
var node_1 = __importDefault(require("./architecture/node"));
exports.NodeElement = node_1.default;
var neat_1 = __importDefault(require("./helpers/neat"));
var multi = __importStar(require("./multithreading/multi"));
exports.multi = multi;
var helpers = {
    architect: architect_1.default,
    Neat: neat_1.default
};
exports.helpers = helpers;
//# sourceMappingURL=index.js.map