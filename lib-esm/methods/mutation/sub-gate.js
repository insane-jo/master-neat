import config from "../../config";
var subGate = {
    name: 'SUB_GATE',
    callback: function (network) {
        // Select a random gated connection
        if (network.gates.length === 0) {
            if (config.warnings)
                console.warn('No more connections to ungate!');
            return;
        }
        var index = Math.floor(Math.random() * network.gates.length);
        var gatedconn = network.gates[index];
        network.ungate(gatedconn);
    }
};
export default subGate;
//# sourceMappingURL=sub-gate.js.map