var Connection = /** @class */ (function () {
    function Connection(from, to, weight) {
        this.gain = 1;
        this.elegibility = 0;
        this.previousDeltaWeight = 0;
        this.totalDeltaWeight = 0;
        this.gater = null;
        this.xtrace = {
            nodes: [],
            values: []
        };
        this.from = from;
        this.to = to;
        this.weight = (typeof weight === 'undefined') ? Math.random() * 0.2 - 0.1 : weight;
    }
    Connection.prototype.toJSON = function () {
        return {
            weight: this.weight
        };
    };
    Connection.innovationID = function (a, b) {
        return 1 / 2 * (a + b) * (a + b + 1) + b;
    };
    return Connection;
}());
export default Connection;
//# sourceMappingURL=connection.js.map