import {IMutation} from "./index";
import Network from "../../architecture/network";

interface IMutationModWeight extends IMutation {
  min: number;
  max: number;
}

const modWeight: IMutationModWeight = {
  name: 'MOD_WEIGHT',
  callback(network: Network) {
    let allconnections = network.connections.concat(network.selfconns);

    let connection = allconnections[Math.floor(Math.random() * allconnections.length)];

    if (!connection) {
      return;
    }

    let modification: number = Math.random() * (this.max - this.min) + this.min;
    connection.weight += modification;
  },
  min: -1,
  max: 1
};

export default modWeight;
