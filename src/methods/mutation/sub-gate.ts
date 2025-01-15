import {IMutation} from "./index";
import Network from "../../architecture/network";
import config from "../../config";

const subGate: IMutation = {
  name: 'SUB_GATE',
  callback(network: Network) {
    // Select a random gated connection
    if (network.gates.length === 0) {
      if (config.warnings) console.warn('No more connections to ungate!');
      return
    }

    let index = Math.floor(Math.random() * network.gates.length);
    let gatedconn = network.gates[index];

    network.ungate(gatedconn);
  }
};

export default subGate;
