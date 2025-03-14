import config from "../../config";
var addConn = {
    name: 'ADD_CONN',
    callback: function (network) {
        // Create an array of all uncreated (feedforward) connections
        var available = [];
        for (var i = 0; i < network.nodes.length - network.output; i++) {
            var node1 = network.nodes[i];
            for (var j = Math.max(i + 1, network.input); j < network.nodes.length; j++) {
                var node2 = network.nodes[j];
                if (!node1.isProjectingTo(node2))
                    available.push([node1, node2]);
            }
        }
        if (available.length === 0) {
            if (config.warnings)
                console.warn('No more connections to be made!');
            return;
        }
        var pair = available[Math.floor(Math.random() * available.length)];
        network.connect(pair[0], pair[1]);
    }
};
export default addConn;
//# sourceMappingURL=add-conn.js.map