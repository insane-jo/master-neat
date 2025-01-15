import {IMutation} from "./index";
import Network from "../../architecture/network";
import config from "../../config";
import Connection from "../../architecture/connection";

const addGate: IMutation = {
  name: 'ADD_GATE',
  callback(network: Network) {
    let allconnections = network.connections.concat(network.selfconns);

    // Create a list of all non-gated connections
    let possible: Connection[] = [];
    for (let i = 0; i < allconnections.length; i++) {
      let conn = allconnections[i];
      if (conn.gater === null) {
        possible.push(conn);
      }
    }

    if (possible.length === 0) {
      if (config.warnings) console.warn('No more connections to gate!');
      return
    }

    // Select a random gater node and connection, can't be gated by input
    let index = Math.floor(Math.random() * (network.nodes.length - network.input) + network.input);
    const node = network.nodes[index];
    let conn = possible[Math.floor(Math.random() * possible.length)];

    // Gate the connection with the node
    network.gate(node, conn);
  }
};

export default addGate;
