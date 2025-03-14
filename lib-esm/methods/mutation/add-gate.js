import config from "../../config";
var addGate = {
    name: 'ADD_GATE',
    callback: function (network) {
        var allconnections = network.connections.concat(network.selfconns);
        // Create a list of all non-gated connections
        var possible = [];
        for (var i = 0; i < allconnections.length; i++) {
            var conn_1 = allconnections[i];
            if (conn_1.gater === null) {
                possible.push(conn_1);
            }
        }
        if (possible.length === 0) {
            if (config.warnings)
                console.warn('No more connections to gate!');
            return;
        }
        // Select a random gater node and connection, can't be gated by input
        var index = Math.floor(Math.random() * (network.nodes.length - network.input) + network.input);
        var node = network.nodes[index];
        var conn = possible[Math.floor(Math.random() * possible.length)];
        // Gate the connection with the node
        network.gate(node, conn);
    }
};
export default addGate;
//# sourceMappingURL=add-gate.js.map