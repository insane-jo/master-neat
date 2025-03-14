import config from "../../config";
var subNode = {
    name: 'SUB_NODE',
    callback: function (network) {
        // Check if there are nodes left to remove
        if (network.nodes.length === network.input + network.output) {
            if (config.warnings)
                console.warn('No more nodes left to remove!');
            return;
        }
        // Select a node which isn't an input or output node
        var index = Math.floor(Math.random() * (network.nodes.length - network.output - network.input) + network.input);
        network.remove(network.nodes[index]);
    },
    keep_gates: true
};
export default subNode;
//# sourceMappingURL=sub-node.js.map