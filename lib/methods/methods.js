"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var activation_1 = __importDefault(require("./activation"));
var mutation_1 = __importDefault(require("./mutation"));
var selection_1 = __importDefault(require("./selection"));
var crossover_1 = __importDefault(require("./crossover"));
var cost_1 = __importDefault(require("./cost"));
var gating_1 = __importDefault(require("./gating"));
var connection_1 = __importDefault(require("./connection"));
var rate_1 = __importDefault(require("./rate"));
exports.default = {
    activation: activation_1.default,
    mutation: mutation_1.default,
    selection: selection_1.default,
    crossover: crossover_1.default,
    cost: cost_1.default,
    gating: gating_1.default,
    connection: connection_1.default,
    rate: rate_1.default
};
//# sourceMappingURL=methods.js.map