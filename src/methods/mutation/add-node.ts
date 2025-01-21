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
    let gater, from, to;
    if (connection) {
      gater = connection.gater;
      from = connection.from;
      to = connection.to;

      network.disconnect(from, to);
    } else {
      from = network.nodes.find((node) => node.type === NodeTypeEnum.input) as NodeElement;
      to = network.nodes.find((node) => node.type === NodeTypeEnum.output) as NodeElement;
    }

    // Insert the new node right before the old connection.to
    let toIndex = network.nodes.indexOf(to);
    let node = new NodeElement(NodeTypeEnum.hidden);

    // Random squash function
    modActivation.mutateNode(node);

    // Place it in this.nodes
    let minBound = Math.min(toIndex, network.nodes.length - network.output);
    network.nodes.splice(minBound, 0, node);

    // Now create two new connections
    let newConn1 = network.connect(from, node)[0];
    let newConn2 = network.connect(node, to)[0];

    // Check if the original connection was gated
    if (gater != null) {
      network.gate(gater, Math.random() >= 0.5 ? newConn1 : newConn2);
    }
  }
};

export default addNode;
