import config from "../../config";
var subConn = {
    name: 'SUB_CONN',
    callback: function (network) {
        // List of possible connections that can be removed
        var possible = [];
        for (var i = 0; i < network.connections.length; i++) {
            var conn = network.connections[i];
            // Check if it is not disabling a node
            if (conn.from.connections.out.length > 1 && conn.to.connections.in.length > 1 && network.nodes.indexOf(conn.to) > network.nodes.indexOf(conn.from)) {
                possible.push(conn);
            }
        }
        if (possible.length === 0) {
            if (config.warnings)
                console.warn('No connections to remove!');
            return;
        }
        var randomConn = possible[Math.floor(Math.random() * possible.length)];
        network.disconnect(randomConn.from, randomConn.to);
    }
};
export default subConn;
//# sourceMappingURL=sub-conn.js.map