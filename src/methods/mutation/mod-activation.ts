import {IMutation} from "./index";
import activation from "../activation";
import Network from "../../architecture/network";
import config from "../../config";
import {IActivationFunction} from "../../types/activation-types";
import NodeElement from "../../architecture/node";

export interface IMutationModActivation extends IMutation {
  mutateOutput: boolean;
  allowed: IActivationFunction[];
  mutateNode: (node: NodeElement) => void;
}

const modActivation: IMutationModActivation = {
  name: 'MOD_ACTIVATION',
  callback(network: Network) {
    // Has no effect on input node, so they are excluded
    if (!this.mutateOutput && network.input + network.output === network.nodes.length) {
      if (config.warnings) console.warn('No nodes that allow mutation of activation function');
      return;
    }

    let index = Math.floor(Math.random() * (network.nodes.length - (this.mutateOutput ? 0 : network.output) - network.input) + network.input);
    const node = network.nodes[index];

    this.mutateNode(node);
  },
  mutateNode(node: NodeElement) {
    node.squash = this.allowed[(this.allowed.indexOf(node.squash) + Math.floor(Math.random() * (this.allowed.length - 1)) + 1) % this.allowed.length];
  },
  mutateOutput: true,
  allowed: [
    activation.LOGISTIC,
    activation.TANH,
    activation.IDENTITY,
    activation.STEP,
    activation.RELU,
    activation.SOFTSIGN,
    activation.SINUSOID,
    activation.GAUSSIAN,
    activation.BENT_IDENTITY,
    activation.BIPOLAR,
    activation.BIPOLAR_SIGMOID,
    activation.HARD_TANH,
    activation.ABSOLUTE,
    activation.INVERSE,
    activation.SELU,
    activation.LEAKY_RELU,
    activation.PRELU,
    activation.ELU,
    activation.SWISH,
    activation.SOFTPLUS,
    activation.MISH,
    activation.GELU,
    activation.ARCTAN,
    activation.SINC,
    activation.SOFT_CLIPPING,
    activation.EXPONENTIAL,
    activation.CUBE,
    activation.SQUARE,
    activation.CLIPPED_RELU,
    activation.THRESHOLDED_RELU,
    activation.LOGIT,
    activation.HARD_SIGMOID,
    activation.HARD_SWISH,
    activation.ELISH
  ]
};

export default modActivation;
