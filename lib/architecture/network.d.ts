import { ICostFunction } from "../methods/cost";
import { IMutation } from "../methods/mutation";
import { IActivationFunction } from "../types/activation-types";
import Connection from "./connection";
import NodeElement from "./node";
import { IRateFunction } from "../methods/rate";
export type INetworkTrainingSetItem = {
    input: number[];
    output: number[];
};
export type INetworkTrainingOptions = {
    error?: number;
    rate?: number;
    dropout?: number;
    momentum?: number;
    batchSize?: number;
    cost?: ICostFunction;
    iterations?: number;
    browserWorkerScriptUrl?: string;
    popsize?: number;
    mutation?: IMutation[];
    equal?: boolean;
    elitism?: number;
    mutationRate?: number;
    mutationAmount?: number;
    ratePolicy?: IRateFunction;
    crossValidate?: {
        testSize: number;
        testError: number;
    };
    clear?: boolean;
    shuffle?: boolean;
    log?: number;
    schedule?: {
        iterations: number;
        function: (x: {
            error: number;
            iteration: number;
            fitness?: number;
        }) => void;
    };
    growth?: number;
    amount?: number;
    threads?: number;
    fitnessPopulation?: boolean;
    network?: Network;
    callback?: (n: Network, result: {
        error: number;
        iteration: number;
        fitness?: number;
    }) => void;
};
export default class Network {
    nodes: NodeElement[];
    connections: Connection[];
    input: number;
    output: number;
    dropout: number;
    gates: Connection[];
    selfconns: Connection[];
    score?: number;
    protected isEvolvingStopped: boolean;
    protected evolvingPromise?: Promise<{
        error: number;
        iterations: number;
        time: number;
    }>;
    constructor(input: number, output: number);
    /**
     * Activates the network
     */
    activate(input: number[], training?: boolean): number[];
    /**
     * Activates the network without calculating elegibility traces and such
     */
    noTraceActivate(input: number[]): number[];
    /**
     * Backpropagate the network
     */
    propagate(rate: number, momentum: number, update: boolean, target: number[]): void;
    /**
     * Clear the context of the network
     */
    clear(): void;
    /**
     * Connects the from node to the to node
     */
    connect(from: NodeElement, to: NodeElement, weight?: number): Connection[];
    /**
     * Disconnects the from node from the to node
     */
    disconnect(from: NodeElement, to: NodeElement): void;
    /**
     * Gate a connection with a node
     */
    gate(node: NodeElement, connection: Connection): void;
    /**
     *  Remove the gate of a connection
     */
    ungate(connection: Connection): void;
    /**
     *  Removes a node from the network
     */
    remove(node: NodeElement): void;
    /**
     * Mutates the network with the given method
     */
    mutate(method?: IMutation): void;
    /**
     * Train the given set to this network
     */
    train(set: INetworkTrainingSetItem[], options?: INetworkTrainingOptions): {
        error: number;
        iterations: number;
        time: number;
    };
    /**
     * Performs one training epoch and returns the error
     * private function used in this.train
     */
    _trainSet(set: INetworkTrainingSetItem[], batchSize: number, currentRate: number, momentum: number, costFunction: ICostFunction): number;
    /**
     * Tests a set and returns the error and elapsed time
     */
    test(set: INetworkTrainingSetItem[], cost?: ICostFunction): {
        error: number;
        time: number;
    };
    /**
     * Convert the network to a json object
     */
    toJSON(): {
        nodes: any[];
        connections: any[];
        input: number;
        output: number;
        dropout: number;
    };
    /**
     * Sets the value of a property for every node in this network
     */
    set(values: {
        bias?: number;
        squash?: IActivationFunction;
    }): void;
    stopEvolve(): Promise<{
        error: number;
        iterations: number;
        time: number;
    }>;
    /**
     * Evolves the network to reach a lower error on a dataset
     */
    evolve(set: INetworkTrainingSetItem[], options: INetworkTrainingOptions): Promise<{
        error: number;
        iterations: number;
        time: number;
    }>;
    /**
     * Creates a standalone function of the network which can be run without the
     * need of a library
     */
    standalone(): string;
    /**
     * Serialize to send to workers efficiently
     */
    serialize(): number[][];
    /**
     * Convert a json object to a network
     */
    static fromJSON(json: any): Network;
    /**
     * Merge two networks into one
     */
    static merge(network1: Network, network2: Network): Network;
    /**
     * Create an offspring from two parent networks
     */
    static crossOver(network1: Network, network2: Network, equal?: boolean): Network;
}
