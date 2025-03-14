import Connection from "./connection";
import { IConnectionDescription } from "../types/methods-collection-types";
import Group from "./group";
import NodeElement from "./node";
import { IConnectionDescriptor } from "../types/connection-descriptor";
type TInputFunction = (from: Layer | Group, method?: IConnectionDescription, weight?: number) => Connection[];
export default class Layer {
    nodes: (NodeElement | Group)[];
    connections: IConnectionDescriptor;
    output: Group;
    input: TInputFunction;
    constructor();
    /**
     * Activates all the nodes in the group
     */
    activate(value: number[]): (number | number[])[];
    /**
     * Propagates all the node in the group
     */
    propagate(rate: number, momentum: number, target: number[]): void;
    /**
     * Connects the nodes in this group to nodes in another group or just a node
     */
    connect(target: Group | NodeElement | Layer, method?: IConnectionDescription, weight?: number): Connection[];
    /**
     * Make nodes from this group gate the given connection(s)
     */
    gate(connections: Connection[], method: IConnectionDescription): void;
    /**
     * Sets the value of a property for every node
     */
    set(values: NodeElement): void;
    /**
     * Disconnects all nodes from this group from another given group/node
     */
    disconnect(target: NodeElement | Group, twosided?: boolean): void;
    /**
     * Clear the context of this group
     */
    clear(): void;
    static Dense(size: number): Layer;
    static LSTM(size: number): Layer;
    static GRU(size: number): Layer;
    static Memory(size: number, memory: number): Layer;
}
export {};
