import Connection from './connection';
import methods from '../methods/methods';
import config from '../config';
import { NodeTypeEnum } from "../types/node-type-enum";
var NodeElement = /** @class */ (function () {
    function NodeElement(nodeType) {
        this.activation = 0;
        this.derivative = 0;
        this.state = 0;
        this.old = 0;
        this.mask = 1;
        // For tracking momentum
        this.previousDeltaBias = 0;
        // Batch training
        this.totalDeltaBias = 0;
        this.error = {
            responsibility: 0,
            projected: 0,
            gated: 0
        };
        this.bias = (nodeType === NodeTypeEnum.input) ? 0 : Math.random() * 0.2 - 0.1;
        this.squash = methods.activation.LOGISTIC;
        this.type = nodeType || NodeTypeEnum.hidden;
        this.connections = {
            in: [],
            out: [],
            gated: [],
            self: new Connection(this, this, 0)
        };
    }
    /**
     * Activates the node
     */
    NodeElement.prototype.activate = function (input) {
        // Check if an input is given
        if (typeof input !== 'undefined') {
            this.activation = input;
            return this.activation;
        }
        this.old = this.state;
        // All activation sources coming from the node itself
        this.state = this.connections.self.gain * this.connections.self.weight * this.state + this.bias;
        // Activation sources coming from connections
        for (var i = 0, cil = this.connections.in.length; i < cil; i++) {
            var connection = this.connections.in[i];
            this.state += connection.from.activation * connection.weight * connection.gain;
        }
        // Squash the values received
        this.activation = this.squash(this.state) * this.mask;
        this.derivative = this.squash(this.state, true);
        // Update traces
        var nodes = [];
        var influences = [];
        for (var i = 0, cgl = this.connections.gated.length; i < cgl; i++) {
            var conn = this.connections.gated[i];
            var node = conn.to;
            var index = nodes.indexOf(node);
            if (index > -1) {
                influences[index] += conn.weight * conn.from.activation;
            }
            else {
                nodes.push(node);
                influences.push(conn.weight * conn.from.activation +
                    (node.connections.self.gater === this ? node.old : 0));
            }
            // Adjust the gain to this nodes' activation
            conn.gain = this.activation;
        }
        for (var i = 0, cil = this.connections.in.length; i < cil; i++) {
            var connection_1 = this.connections.in[i];
            // Elegibility trace
            connection_1.elegibility = this.connections.self.gain * this.connections.self.weight *
                connection_1.elegibility + connection_1.from.activation * connection_1.gain;
            // Extended trace
            for (var j = 0, nl = nodes.length; j < nl; j++) {
                var node = nodes[j];
                var influence = influences[j];
                var index = connection_1.xtrace.nodes.indexOf(node);
                if (index > -1) {
                    connection_1.xtrace.values[index] = node.connections.self.gain * node.connections.self.weight *
                        connection_1.xtrace.values[index] + this.derivative * connection_1.elegibility * influence;
                }
                else {
                    // Does not exist there yet, might be through mutation
                    connection_1.xtrace.nodes.push(node);
                    connection_1.xtrace.values.push(this.derivative * connection_1.elegibility * influence);
                }
            }
        }
        return this.activation;
    };
    /**
     * Activates the node without calculating elegibility traces and such
     */
    NodeElement.prototype.noTraceActivate = function (input) {
        // Check if an input is given
        if (typeof input !== 'undefined') {
            this.activation = input;
            return this.activation;
        }
        // All activation sources coming from the node itself
        this.state = this.connections.self.gain * this.connections.self.weight * this.state + this.bias;
        for (var _i = 0, _a = this.connections.in; _i < _a.length; _i++) {
            var connection = _a[_i];
            this.state += connection.from.activation * connection.weight * connection.gain;
        }
        // // Activation sources coming from connections
        // for (let i = 0, cil = this.connections.in.length; i < cil; i++) {
        //   var connection = this.connections.in[i];
        //   this.state += connection.from.activation * connection.weight * connection.gain;
        // }
        // Squash the values received
        this.activation = this.squash(this.state);
        for (var _b = 0, _c = this.connections.gated; _b < _c.length; _b++) {
            var connection = _c[_b];
            connection.gain = this.activation;
        }
        // for (let i = 0, cgl = this.connections.gated.length; i < cgl; i++) {
        //   this.connections.gated[i].gain = this.activation;
        // }
        return this.activation;
    };
    /**
     * Back-propagate the error, aka learn
     */
    NodeElement.prototype.propagate = function (rate, momentum, update, target) {
        //    momentum = momentum || 0;
        //    rate = rate || 0.3;
        if (rate === void 0) { rate = 0.3; }
        if (momentum === void 0) { momentum = 0; }
        // Error accumulator
        var error = 0;
        // Output nodes get their error from the enviroment
        if (this.type === NodeTypeEnum.output) {
            this.error.responsibility = this.error.projected = (target || 0) - this.activation;
        }
        else { // the rest of the nodes compute their error responsibilities by backpropagation
            // error responsibilities from all the connections projected from this node
            for (var i = 0; i < this.connections.out.length; i++) {
                var connection = this.connections.out[i];
                var node = connection.to;
                // Eq. 21
                error += node.error.responsibility * connection.weight * connection.gain;
            }
            // Projected error responsibility
            this.error.projected = this.derivative * error;
            // Error responsibilities from all connections gated by this neuron
            error = 0;
            for (var i = 0; i < this.connections.gated.length; i++) {
                var conn = this.connections.gated[i];
                var node = conn.to;
                var influence = node.connections.self.gater === this ? node.old : 0;
                influence += conn.weight * conn.from.activation;
                error += node.error.responsibility * influence;
            }
            // Gated error responsibility
            this.error.gated = this.derivative * error;
            // Error responsibility
            this.error.responsibility = this.error.projected + this.error.gated;
        }
        if (this.type === NodeTypeEnum.constant)
            return;
        // Adjust all the node's incoming connections
        for (var i = 0; i < this.connections.in.length; i++) {
            var connection = this.connections.in[i];
            var gradient = this.error.projected * connection.elegibility;
            for (var j = 0; j < connection.xtrace.nodes.length; j++) {
                var node = connection.xtrace.nodes[j];
                var value = connection.xtrace.values[j];
                gradient += node.error.responsibility * value;
            }
            // Adjust weight
            var deltaWeight = rate * gradient * this.mask;
            connection.totalDeltaWeight += deltaWeight;
            if (update) {
                connection.totalDeltaWeight += momentum * connection.previousDeltaWeight;
                connection.weight += connection.totalDeltaWeight;
                connection.previousDeltaWeight = connection.totalDeltaWeight;
                connection.totalDeltaWeight = 0;
            }
        }
        // Adjust bias
        var deltaBias = rate * this.error.responsibility;
        this.totalDeltaBias += deltaBias;
        if (update) {
            this.totalDeltaBias += momentum * this.previousDeltaBias;
            this.bias += this.totalDeltaBias;
            this.previousDeltaBias = this.totalDeltaBias;
            this.totalDeltaBias = 0;
        }
    };
    /**
     * Creates a connection from this node to the given node
     */
    NodeElement.prototype.connect = function (target, weight) {
        var connections = [];
        if (typeof target.bias !== 'undefined') { // must be a node!
            target = target;
            if (target === this) {
                // Turn on the self connection by setting the weight
                if (this.connections.self.weight !== 0) {
                    if (config.warnings)
                        console.warn('This connection already exists!');
                }
                else {
                    this.connections.self.weight = weight || 1;
                }
                connections.push(this.connections.self);
            }
            else if (this.isProjectingTo(target)) {
                throw new Error('Already projecting a connection to this node!');
            }
            else {
                var connection = new Connection(this, target, weight);
                target.connections.in.push(connection);
                this.connections.out.push(connection);
                connections.push(connection);
            }
        }
        else { // should be a group
            target = target;
            for (var i = 0; i < target.nodes.length; i++) {
                var connection = new Connection(this, target.nodes[i], weight);
                target.nodes[i].connections.in.push(connection);
                this.connections.out.push(connection);
                target.connections.in.push(connection);
                connections.push(connection);
            }
        }
        return connections;
    };
    /**
     * Disconnects this node from the other node
     */
    NodeElement.prototype.disconnect = function (node, twosided) {
        if (this === node) {
            this.connections.self.weight = 0;
            return;
        }
        for (var i = 0; i < this.connections.out.length; i++) {
            var conn = this.connections.out[i];
            if (conn.to === node) {
                this.connections.out.splice(i, 1);
                var j = conn.to.connections.in.indexOf(conn);
                conn.to.connections.in.splice(j, 1);
                if (conn.gater !== null)
                    conn.gater.ungate(conn);
                break;
            }
        }
        if (twosided) {
            node.disconnect(this);
        }
    };
    /**
     * Make this node gate a connection
     */
    NodeElement.prototype.gate = function (connections) {
        if (!Array.isArray(connections)) {
            connections = [connections];
        }
        for (var i = 0; i < connections.length; i++) {
            var connection = connections[i];
            this.connections.gated.push(connection);
            connection.gater = this;
        }
    };
    /**
     * Removes the gates from this node from the given connection(s)
     */
    NodeElement.prototype.ungate = function (connections) {
        if (!Array.isArray(connections)) {
            connections = [connections];
        }
        for (var i = connections.length - 1; i >= 0; i--) {
            var connection = connections[i];
            var index = this.connections.gated.indexOf(connection);
            this.connections.gated.splice(index, 1);
            connection.gater = null;
            connection.gain = 1;
        }
    };
    /**
     * Clear the context of the node
     */
    NodeElement.prototype.clear = function () {
        for (var i = 0; i < this.connections.in.length; i++) {
            var connection = this.connections.in[i];
            connection.elegibility = 0;
            connection.xtrace = {
                nodes: [],
                values: []
            };
        }
        for (i = 0; i < this.connections.gated.length; i++) {
            var conn = this.connections.gated[i];
            conn.gain = 0;
        }
        this.error.responsibility = this.error.projected = this.error.gated = 0;
        this.old = this.state = this.activation = 0;
    };
    /**
     * Checks if this node is projecting to the given node
     */
    NodeElement.prototype.isProjectingTo = function (node) {
        if (node === this && this.connections.self.weight !== 0)
            return true;
        for (var i = 0; i < this.connections.out.length; i++) {
            var conn = this.connections.out[i];
            if (conn.to === node) {
                return true;
            }
        }
        return false;
    };
    /**
     * Checks if the given node is projecting to this node
     */
    NodeElement.prototype.isProjectedBy = function (node) {
        if (node === this && this.connections.self.weight !== 0)
            return true;
        for (var i = 0; i < this.connections.in.length; i++) {
            var conn = this.connections.in[i];
            if (conn.from === node) {
                return true;
            }
        }
        return false;
    };
    /**
     * Converts the node to a json object
     */
    NodeElement.prototype.toJSON = function () {
        return {
            bias: this.bias,
            type: this.type,
            squash: this.squash.name,
            mask: this.mask
        };
    };
    /**
     * @todo: Удалить тип any или сделать валидацию
     */
    NodeElement.fromJSON = function (json) {
        var node = new NodeElement();
        node.bias = json.bias;
        node.type = json.type;
        node.mask = json.mask;
        node.squash = methods.activation[json.squash];
        return node;
    };
    return NodeElement;
}());
export default NodeElement;
//# sourceMappingURL=node.js.map