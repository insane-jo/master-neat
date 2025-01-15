import {IMutation} from "./index";
import Network from "../../architecture/network";
import config from "../../config";

interface IMutationSwapNodes extends IMutation {
  mutateOutput: boolean;
}

const swapNodes: IMutationSwapNodes = {
  name: 'SWAP_NODES',
  callback(network: Network) {
    // Has no effect on input node, so they are excluded
    if ((this.mutateOutput && network.nodes.length - network.input < 2) ||
      (!this.mutateOutput && network.nodes.length - network.input - network.output < 2)) {
      if (config.warnings) console.warn('No nodes that allow swapping of bias and activation function');
      return
    }

    let index = Math.floor(Math.random() * (network.nodes.length - (this.mutateOutput ? 0 : network.output) - network.input) + network.input);
    let node1 = network.nodes[index];
    index = Math.floor(Math.random() * (network.nodes.length - (this.mutateOutput ? 0 : network.output) - network.input) + network.input);
    let node2 = network.nodes[index];

    let biasTemp = node1.bias;
    let squashTemp = node1.squash;

    node1.bias = node2.bias;
    node1.squash = node2.squash;
    node2.bias = biasTemp;
    node2.squash = squashTemp;
  },
  mutateOutput: true
};

export default swapNodes;
