import config from "../../config";
var addBackConn = {
    name: 'ADD_BACK_CONN',
    callback: function (network) {
        // Create an array of all uncreated (backfed) connections
        var available = [];
        for (var i = network.input; i < network.nodes.length; i++) {
            var node1 = network.nodes[i];
            for (var j = network.input; j < i; j++) {
                var node2 = network.nodes[j];
                if (!node1.isProjectingTo(node2)) {
                    available.push([node1, node2]);
                }
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
export default addBackConn;
//# sourceMappingURL=add-back-conn.js.map