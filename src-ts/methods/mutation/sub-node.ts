import {IMutation} from "./index";
import Network from "../../architecture/network";
import config from "../../config";

interface IMutationSubNode extends IMutation {
  keep_gates: boolean;
}

const subNode: IMutationSubNode = {
  name: 'SUB_NODE',
  callback(network: Network) {
    // Check if there are nodes left to remove
    if (network.nodes.length === network.input + network.output) {
      if (config.warnings) console.warn('No more nodes left to remove!');
      return;
    }

    // Select a node which isn't an input or output node
    let index = Math.floor(Math.random() * (network.nodes.length - network.output - network.input) + network.input);
    network.remove(network.nodes[index]);
  },
  keep_gates: true
};

export default subNode;
