"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var modBias = {
    name: 'MOD_BIAS',
    callback: function (network) {
        // Has no effect on input node, so they are excluded
        var index = Math.floor(Math.random() * (network.nodes.length - network.input) + network.input);
        var node = network.nodes[index];
        this.mutateNode(node);
    },
    mutateNode: function (node) {
        var modification = Math.random() * (this.max - this.min) + this.min;
        node.bias += modification;
    },
    min: -1,
    max: 1,
};
exports.default = modBias;
//# sourceMappingURL=mod-bias.js.map