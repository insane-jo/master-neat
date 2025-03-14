"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var add_node_1 = __importDefault(require("./add-node"));
var sub_node_1 = __importDefault(require("./sub-node"));
var add_conn_1 = __importDefault(require("./add-conn"));
var sub_conn_1 = __importDefault(require("./sub-conn"));
var mod_weight_1 = __importDefault(require("./mod-weight"));
var mod_bias_1 = __importDefault(require("./mod-bias"));
var mod_activation_1 = __importDefault(require("./mod-activation"));
var add_gate_1 = __importDefault(require("./add-gate"));
var sub_gate_1 = __importDefault(require("./sub-gate"));
var add_self_conn_1 = __importDefault(require("./add-self-conn"));
var sub_self_conn_1 = __importDefault(require("./sub-self-conn"));
var add_back_conn_1 = __importDefault(require("./add-back-conn"));
var sub_back_conn_1 = __importDefault(require("./sub-back-conn"));
var swap_nodes_1 = __importDefault(require("./swap-nodes"));
var mutations = {
    ALL: [
        add_node_1.default,
        sub_node_1.default,
        add_conn_1.default,
        sub_conn_1.default,
        mod_weight_1.default,
        mod_bias_1.default,
        mod_activation_1.default,
        add_gate_1.default,
        sub_gate_1.default,
        add_self_conn_1.default,
        sub_self_conn_1.default,
        add_back_conn_1.default,
        sub_back_conn_1.default,
        swap_nodes_1.default
    ],
    FFW: [
        add_node_1.default,
        sub_node_1.default,
        add_conn_1.default,
        sub_conn_1.default,
        mod_weight_1.default,
        mod_bias_1.default,
        mod_activation_1.default,
        swap_nodes_1.default
    ]
};
exports.default = mutations;
//# sourceMappingURL=index.js.map