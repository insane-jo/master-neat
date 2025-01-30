import Network from '../architecture/network';
import Layer from '../architecture/layer';
import Group from '../architecture/group';
import NodeElement from '../architecture/node';
/*******************************************************************************
                                        architect
*******************************************************************************/
declare var architect: {
    /**
     * Constructs a network from a given array of connected nodes
     */
    Construct: (list: (NodeElement | Group | Layer)[]) => Network;
    /**
     * Creates a multilayer perceptron (MLP)
     */
    Perceptron: (...args: number[]) => Network;
    /**
     * Creates a randomly connected network
     */
    Random: (input: number, hidden: number, output: number, options?: {
        connections?: number;
        backconnections?: number;
        selfconnections?: number;
        gates?: number;
    }) => Network;
    /**
     * Creates a long short-term memory network
     */
    LSTM: (...inArgs: number[]) => Network;
    /**
     * Creates a gated recurrent unit network
     */
    GRU: (...inArgs: number[]) => Network;
    /**
     * Creates a hopfield network of the given size
     */
    Hopfield: (size: number) => Network;
    /**
     * Creates a NARX network (remember previous inputs/outputs)
     */
    NARX: (inputSize: number, hiddenLayers: number | number[], outputSize: number, previousInput: number, previousOutput: number) => Network;
};
export default architect;
