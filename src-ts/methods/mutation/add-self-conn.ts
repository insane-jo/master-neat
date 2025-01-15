import {IMutation} from "./index";
import Network from "../../architecture/network";
import config from "../../config";
import NodeElement from "../../architecture/node";

const addSelfConn: IMutation = {
  name: 'ADD_SELF_CONN',
  callback(network: Network) {
    // Check which nodes aren't selfconnected yet
    let possible: NodeElement[] = [];
    for (let i = network.input; i < network.nodes.length; i++) {
      let node = network.nodes[i];
      if (node.connections.self.weight === 0) {
        possible.push(node);
      }
    }

    if (possible.length === 0) {
      if (config.warnings) console.warn('No more self-connections to add!');
      return;
    }

    // Select a random node
    const node = possible[Math.floor(Math.random() * possible.length)];

    // Connect it to himself
    network.connect(node, node);
  }
};

export default addSelfConn;
