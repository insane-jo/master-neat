import {IMutation} from "./index";
import activation from "../activation";
import Network from "../../architecture/network";
import config from "../../config";
import {IActivationFunction} from "../../types/activation-types";

export interface IMutationModActivation extends IMutation {
  mutateOutput: boolean;
  allowed: IActivationFunction[];
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

    node.mutate(this);
  },
  mutateOutput: true,
  allowed: [
    activation.LOGISTIC,
    activation.TANH,
    activation.RELU,
    activation.IDENTITY,
    activation.STEP,
    activation.SOFTSIGN,
    activation.SINUSOID,
    activation.GAUSSIAN,
    activation.BENT_IDENTITY,
    activation.BIPOLAR,
    activation.BIPOLAR_SIGMOID,
    activation.HARD_TANH,
    activation.ABSOLUTE,
    activation.INVERSE,
    activation.SELU
  ]
};

export default modActivation;
