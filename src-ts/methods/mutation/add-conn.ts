import {IMutation} from "./index";
import Network from "../../architecture/network";
import config from "../../config";

const addConn: IMutation = {
  name: 'ADD_CONN',
  callback(network: Network) {
    // Create an array of all uncreated (feedforward) connections
    let available = [];
    for (let i = 0; i < network.nodes.length - network.output; i++) {
      let node1 = network.nodes[i];
      for (let j = Math.max(i + 1, network.input); j < network.nodes.length; j++) {
        let node2 = network.nodes[j];
        if (!node1.isProjectingTo(node2)) available.push([node1, node2]);
      }
    }

    if (available.length === 0) {
      if (config.warnings) console.warn('No more connections to be made!');
      return
    }

    let pair = available[Math.floor(Math.random() * available.length)];
    network.connect(pair[0], pair[1]);
  }
};

export default addConn;
