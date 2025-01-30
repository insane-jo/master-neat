import methods from './methods/methods';
import Connection from './architecture/connection';
import Network from './architecture/network';
import config from './config';
import Group from './architecture/group';
import Layer from './architecture/layer';
import NodeElement from './architecture/node';
import Neat from './helpers/neat';
import * as multi from './multithreading/multi';
declare const helpers: {
    architect: {
        Construct: (list: (NodeElement | Group | Layer)[]) => Network;
        Perceptron: (...args: number[]) => Network;
        Random: (input: number, hidden: number, output: number, options?: {
            connections?: number;
            backconnections?: number;
            selfconnections?: number;
            gates?: number;
        }) => Network;
        LSTM: (...inArgs: number[]) => Network;
        GRU: (...inArgs: number[]) => Network;
        Hopfield: (size: number) => Network;
        NARX: (inputSize: number, hiddenLayers: number | number[], outputSize: number, previousInput: number, previousOutput: number) => Network;
    };
    Neat: typeof Neat;
};
export { methods, Connection, Network, config, Group, Layer, NodeElement, multi, helpers };
