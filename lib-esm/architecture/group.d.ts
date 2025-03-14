import NodeElement from "./node";
import Connection from "./connection";
import { IConnectionDescription } from "../types/methods-collection-types";
import { IGate } from "../types/methods-gating-types";
import { IActivationFunction } from "../types/activation-types";
import Layer from './layer';
import { IConnectionDescriptor } from "../types/connection-descriptor";
import { NodeTypeEnum } from "../types/node-type-enum";
export default class Group {
    nodes: NodeElement[];
    connections: IConnectionDescriptor;
    constructor(size: number);
    /**
     * Activates all the nodes in the group
     */
    activate(value?: number[]): number[];
    /**
     * Propagates all the node in the group
     */
    propagate(rate: number, momentum: number, target: number[]): void;
    /**
     * Connects the nodes in this group to nodes in another group or just a node
     */
    connect(target: Group | Layer | NodeElement, method?: IConnectionDescription, weight?: number): Connection[];
    /**
     * Make nodes from this group gate the given connection(s)
     */
    gate(connections: Connection | Connection[], method: IGate): void;
    /**
     * Sets the value of a property for every node
     */
    set(values: {
        bias?: number;
        squash?: IActivationFunction;
        type?: NodeTypeEnum;
    }): void;
    disconnect(target: Group | NodeElement, twosided?: boolean): void;
    /**
     * Clear the context of this group
     */
    clear(): void;
}
