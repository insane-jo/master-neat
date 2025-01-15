import {IMutation} from "./index";
import Network from "../../architecture/network";
import NodeElement from "../../architecture/node";

export interface IMutationModBias extends IMutation {
  min: number;
  max: number;
  mutateNode: (node: NodeElement) => void;
}

const modBias: IMutationModBias = {
  name: 'MOD_BIAS',
  callback(network: Network) {
    // Has no effect on input node, so they are excluded
    let index = Math.floor(Math.random() * (network.nodes.length - network.input) + network.input);
    const node: NodeElement = network.nodes[index];
    this.mutateNode(node);
  },
  mutateNode(node: NodeElement) {
    let modification = Math.random() * (this.max - this.min) + this.min;
    node.bias += modification;
  },
  min: -1,
  max: 1,
};

export default modBias;
