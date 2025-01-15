import {IMutation} from "./index";
import Network from "../../architecture/network";
import config from "../../config";

const addBackConn: IMutation = {
  name: 'ADD_BACK_CONN',
  callback(network: Network) {
    // Create an array of all uncreated (backfed) connections
    let available = [];
    for (let i = network.input; i < network.nodes.length; i++) {
      let node1 = network.nodes[i];
      for (let j = network.input; j < i; j++) {
        let node2 = network.nodes[j];
        if (!node1.isProjectingTo(node2)) {
          available.push([node1, node2]);
        }
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

export default addBackConn;
