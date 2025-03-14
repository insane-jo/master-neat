import config from "../../config";
var swapNodes = {
    name: 'SWAP_NODES',
    callback: function (network) {
        // Has no effect on input node, so they are excluded
        if ((this.mutateOutput && network.nodes.length - network.input < 2) ||
            (!this.mutateOutput && network.nodes.length - network.input - network.output < 2)) {
            if (config.warnings)
                console.warn('No nodes that allow swapping of bias and activation function');
            return;
        }
        var index = Math.floor(Math.random() * (network.nodes.length - (this.mutateOutput ? 0 : network.output) - network.input) + network.input);
        var node1 = network.nodes[index];
        index = Math.floor(Math.random() * (network.nodes.length - (this.mutateOutput ? 0 : network.output) - network.input) + network.input);
        var node2 = network.nodes[index];
        var biasTemp = node1.bias;
        var squashTemp = node1.squash;
        node1.bias = node2.bias;
        node1.squash = node2.squash;
        node2.bias = biasTemp;
        node2.squash = squashTemp;
    },
    mutateOutput: true
};
export default swapNodes;
//# sourceMappingURL=swap-nodes.js.map