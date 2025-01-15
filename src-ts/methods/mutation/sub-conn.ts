import {IMutation} from "./index";
import Network from "../../architecture/network";
import config from "../../config";

const subConn: IMutation = {
  name: 'SUB_CONN',
  callback(network: Network) {
    // List of possible connections that can be removed
    let possible = [];

    for (let i = 0; i < network.connections.length; i++) {
      let conn = network.connections[i];
      // Check if it is not disabling a node
      if (conn.from.connections.out.length > 1 && conn.to.connections.in.length > 1 && network.nodes.indexOf(conn.to) > network.nodes.indexOf(conn.from)) {
        possible.push(conn);
      }
    }

    if (possible.length === 0) {
      if (config.warnings) console.warn('No connections to remove!');
      return
    }

    let randomConn = possible[Math.floor(Math.random() * possible.length)];
    network.disconnect(randomConn.from, randomConn.to);
  }
};

export default subConn;
