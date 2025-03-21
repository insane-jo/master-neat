import NodeElement from "./node";
import methods from "../methods/methods";
import Layer from './layer';
import config from "../config";
var Group = /** @class */ (function () {
    function Group(size) {
        this.nodes = [];
        this.connections = {
            in: [],
            out: [],
            self: []
        };
        for (var i = 0; i < size; i++) {
            this.nodes.push(new NodeElement());
        }
    }
    /**
     * Activates all the nodes in the group
     */
    Group.prototype.activate = function (value) {
        var values = [];
        if (typeof value !== 'undefined' && value.length !== this.nodes.length) {
            throw new Error('Array with values should be same as the amount of nodes!');
        }
        for (var i = 0; i < this.nodes.length; i++) {
            var activation = void 0;
            if (typeof value === 'undefined') {
                activation = this.nodes[i].activate();
            }
            else {
                activation = this.nodes[i].activate(value[i]);
            }
            values.push(activation);
        }
        return values;
    };
    /**
     * Propagates all the node in the group
     */
    Group.prototype.propagate = function (rate, momentum, target) {
        if (typeof target !== 'undefined' && target.length !== this.nodes.length) {
            throw new Error('Array with values should be same as the amount of nodes!');
        }
        for (var i = this.nodes.length - 1; i >= 0; i--) {
            if (typeof target === 'undefined') {
                this.nodes[i].propagate(rate, momentum, true);
            }
            else {
                this.nodes[i].propagate(rate, momentum, true, target[i]);
            }
        }
    };
    /**
     * Connects the nodes in this group to nodes in another group or just a node
     */
    Group.prototype.connect = function (target, method, weight) {
        var connections = [];
        var i, j;
        if (target instanceof Group) {
            if (typeof method === 'undefined') {
                if (this !== target) {
                    if (config.warnings)
                        console.warn('No group connection specified, using ALL_TO_ALL');
                    method = methods.connection.ALL_TO_ALL;
                }
                else {
                    if (config.warnings)
                        console.warn('No group connection specified, using ONE_TO_ONE');
                    method = methods.connection.ONE_TO_ONE;
                }
            }
            if (method === methods.connection.ALL_TO_ALL || method === methods.connection.ALL_TO_ELSE) {
                for (i = 0; i < this.nodes.length; i++) {
                    for (j = 0; j < target.nodes.length; j++) {
                        if (method === methods.connection.ALL_TO_ELSE && this.nodes[i] === target.nodes[j])
                            continue;
                        var connection = this.nodes[i].connect(target.nodes[j], weight);
                        this.connections.out.push(connection[0]);
                        target.connections.in.push(connection[0]);
                        connections.push(connection[0]);
                    }
                }
            }
            else if (method === methods.connection.ONE_TO_ONE) {
                if (this.nodes.length !== target.nodes.length) {
                    throw new Error('From and To group must be the same size!');
                }
                for (i = 0; i < this.nodes.length; i++) {
                    var connection = this.nodes[i].connect(target.nodes[i], weight);
                    this.connections.self.push(connection[0]);
                    connections.push(connection[0]);
                }
            }
        }
        else if (target instanceof Layer) {
            connections = target.input(this, method, weight);
        }
        else {
            for (i = 0; i < this.nodes.length; i++) {
                var connection = this.nodes[i].connect(target, weight);
                this.connections.out.push(connection[0]);
                connections.push(connection[0]);
            }
        }
        return connections;
    };
    /**
     * Make nodes from this group gate the given connection(s)
     */
    Group.prototype.gate = function (connections, method) {
        if (typeof method === 'undefined') {
            throw new Error('Please specify Gating.INPUT, Gating.OUTPUT');
        }
        if (!Array.isArray(connections)) {
            connections = [connections];
        }
        var nodes1 = [];
        var nodes2 = [];
        var i, j;
        for (i = 0; i < connections.length; i++) {
            var connection = connections[i];
            if (!nodes1.includes(connection.from))
                nodes1.push(connection.from);
            if (!nodes2.includes(connection.to))
                nodes2.push(connection.to);
        }
        switch (method) {
            case methods.gating.INPUT:
                for (i = 0; i < nodes2.length; i++) {
                    var node = nodes2[i];
                    var gater = this.nodes[i % this.nodes.length];
                    for (j = 0; j < node.connections.in.length; j++) {
                        var conn = node.connections.in[j];
                        if (connections.includes(conn)) {
                            gater.gate(conn);
                        }
                    }
                }
                break;
            case methods.gating.OUTPUT:
                for (i = 0; i < nodes1.length; i++) {
                    var node = nodes1[i];
                    var gater = this.nodes[i % this.nodes.length];
                    for (j = 0; j < node.connections.out.length; j++) {
                        var conn = node.connections.out[j];
                        if (connections.includes(conn)) {
                            gater.gate(conn);
                        }
                    }
                }
                break;
            case methods.gating.SELF:
                for (i = 0; i < nodes1.length; i++) {
                    var node = nodes1[i];
                    var gater = this.nodes[i % this.nodes.length];
                    if (connections.includes(node.connections.self)) {
                        gater.gate(node.connections.self);
                    }
                }
        }
    };
    /**
     * Sets the value of a property for every node
     */
    Group.prototype.set = function (values) {
        for (var i = 0; i < this.nodes.length; i++) {
            if (typeof values.bias !== 'undefined') {
                this.nodes[i].bias = values.bias;
            }
            this.nodes[i].squash = values.squash || this.nodes[i].squash;
            this.nodes[i].type = values.type || this.nodes[i].type;
        }
    };
    Group.prototype.disconnect = function (target, twosided) {
        if (twosided === void 0) { twosided = false; }
        // In the future, disconnect will return a connection so indexOf can be used
        var i, j, k;
        if (target instanceof Group) {
            for (i = 0; i < this.nodes.length; i++) {
                for (j = 0; j < target.nodes.length; j++) {
                    this.nodes[i].disconnect(target.nodes[j], twosided);
                    for (k = this.connections.out.length - 1; k >= 0; k--) {
                        var conn_1 = this.connections.out[k];
                        if (conn_1.from === this.nodes[i] && conn_1.to === target.nodes[j]) {
                            this.connections.out.splice(k, 1);
                            break;
                        }
                    }
                    if (twosided) {
                        for (k = this.connections.in.length - 1; k >= 0; k--) {
                            var conn_2 = this.connections.in[k];
                            if (conn_2.from === target.nodes[j] && conn_2.to === this.nodes[i]) {
                                this.connections.in.splice(k, 1);
                                break;
                            }
                        }
                    }
                }
            }
        }
        else {
            for (i = 0; i < this.nodes.length; i++) {
                this.nodes[i].disconnect(target, twosided);
                for (j = this.connections.out.length - 1; j >= 0; j--) {
                    var conn_3 = this.connections.out[j];
                    if (conn_3.from === this.nodes[i] && conn_3.to === target) {
                        this.connections.out.splice(j, 1);
                        break;
                    }
                }
                if (twosided) {
                    for (j = this.connections.in.length - 1; j >= 0; j--) {
                        var conn = this.connections.in[j];
                        if (conn.from === target && conn.to === this.nodes[i]) {
                            this.connections.in.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        }
    };
    /**
     * Clear the context of this group
     */
    Group.prototype.clear = function () {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].clear();
        }
    };
    return Group;
}());
export default Group;
//# sourceMappingURL=group.js.map