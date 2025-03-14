"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var activation_1 = __importDefault(require("../activation"));
var config_1 = __importDefault(require("../../config"));
var modActivation = {
    name: 'MOD_ACTIVATION',
    callback: function (network) {
        // Has no effect on input node, so they are excluded
        if (!this.mutateOutput && network.input + network.output === network.nodes.length) {
            if (config_1.default.warnings)
                console.warn('No nodes that allow mutation of activation function');
            return;
        }
        var index = Math.floor(Math.random() * (network.nodes.length - (this.mutateOutput ? 0 : network.output) - network.input) + network.input);
        var node = network.nodes[index];
        this.mutateNode(node);
    },
    mutateNode: function (node) {
        node.squash = this.allowed[(this.allowed.indexOf(node.squash) + Math.floor(Math.random() * (this.allowed.length - 1)) + 1) % this.allowed.length];
    },
    mutateOutput: true,
    allowed: [
        activation_1.default.LOGISTIC,
        activation_1.default.TANH,
        activation_1.default.IDENTITY,
        activation_1.default.STEP,
        activation_1.default.RELU,
        activation_1.default.SOFTSIGN,
        activation_1.default.SINUSOID,
        activation_1.default.GAUSSIAN,
        activation_1.default.BENT_IDENTITY,
        activation_1.default.BIPOLAR,
        activation_1.default.BIPOLAR_SIGMOID,
        activation_1.default.HARD_TANH,
        activation_1.default.ABSOLUTE,
        activation_1.default.INVERSE,
        activation_1.default.SELU,
        activation_1.default.LEAKY_RELU,
        activation_1.default.PRELU,
        activation_1.default.ELU,
        activation_1.default.SWISH,
        activation_1.default.SOFTPLUS,
        activation_1.default.MISH,
        activation_1.default.GELU,
        activation_1.default.ARCTAN,
        activation_1.default.SINC,
        activation_1.default.SOFT_CLIPPING,
        activation_1.default.EXPONENTIAL,
        activation_1.default.CUBE,
        activation_1.default.SQUARE,
        activation_1.default.CLIPPED_RELU,
        activation_1.default.THRESHOLDED_RELU,
        activation_1.default.LOGIT,
        activation_1.default.HARD_SIGMOID,
        activation_1.default.HARD_SWISH,
        activation_1.default.ELISH
    ]
};
exports.default = modActivation;
//# sourceMappingURL=mod-activation.js.map