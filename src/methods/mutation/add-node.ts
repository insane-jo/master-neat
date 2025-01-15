import {IMutation} from "./index";
import Network from "../../architecture/network";
import NodeElement from "../../architecture/node";
import {NodeTypeEnum} from "../../types/node-type-enum";
import modActivation from "./mod-activation";

const addNode: IMutation = {
  name: 'ADD_NODE',
  callback(network: Network) {
    // Look for an existing connection and place a node in between
    let connection = network.connections[Math.floor(Math.random() * network.connections.length)];
    let gater = connection.gater;
    network.disconnect(connection.from, connection.to);

    // Insert the new node right before the old connection.to
    let toIndex = network.nodes.indexOf(connection.to);
    let node = new NodeElement(NodeTypeEnum.hidden);

    // Random squash function
    modActivation.mutateNode(node);

    // Place it in this.nodes
    let minBound = Math.min(toIndex, network.nodes.length - network.output);
    network.nodes.splice(minBound, 0, node);

    // Now create two new connections
    let newConn1 = network.connect(connection.from, node)[0];
    let newConn2 = network.connect(node, connection.to)[0];

    // Check if the original connection was gated
    if (gater != null) {
      network.gate(gater, Math.random() >= 0.5 ? newConn1 : newConn2);
    }
  }
};

export default addNode;
