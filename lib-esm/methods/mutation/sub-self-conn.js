import config from "../../config";
var subSelfConn = {
    name: 'SUB_SELF_CONN',
    callback: function (network) {
        if (network.selfconns.length === 0) {
            if (config.warnings)
                console.warn('No more self-connections to remove!');
            return;
        }
        var conn = network.selfconns[Math.floor(Math.random() * network.selfconns.length)];
        network.disconnect(conn.from, conn.to);
    }
};
export default subSelfConn;
//# sourceMappingURL=sub-self-conn.js.map