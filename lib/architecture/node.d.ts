import { IActivationFunction } from "../types/activation-types";
import Connection from './connection';
import Group from './group';
import { NodeTypeEnum } from "../types/node-type-enum";
type NodeConnectionsDescriptor = {
    in: Connection[];
    out: Connection[];
    gated: Connection[];
    self: Connection;
};
type NodeErrorDescriptor = {
    responsibility: number;
    projected: number;
    gated: number;
};
export default class NodeElement {
    bias: number;
    squash: IActivationFunction;
    type: NodeTypeEnum;
    activation: number;
    derivative: number;
    state: number;
    old: number;
    mask: number;
    previousDeltaBias: number;
    totalDeltaBias: number;
    connections: NodeConnectionsDescriptor;
    error: NodeErrorDescriptor;
    constructor(nodeType?: NodeTypeEnum);
    /**
     * Activates the node
     */
    activate(input?: number): number;
    /**
     * Activates the node without calculating elegibility traces and such
     */
    noTraceActivate(input?: number): number;
    /**
     * Back-propagate the error, aka learn
     */
    propagate(rate: number | undefined, momentum: number | undefined, update: boolean, target?: number): void;
    /**
     * Creates a connection from this node to the given node
     */
    connect(target: NodeElement | Group, weight?: number): Connection[];
    /**
     * Disconnects this node from the other node
     */
    disconnect(node: NodeElement, twosided?: boolean): void;
    /**
     * Make this node gate a connection
     */
    gate(connections: Connection | Connection[]): void;
    /**
     * Removes the gates from this node from the given connection(s)
     */
    ungate(connections: Connection | Connection[]): void;
    /**
     * Clear the context of the node
     */
    clear(): void;
    /**
     * Checks if this node is projecting to the given node
     */
    isProjectingTo(node: NodeElement): boolean;
    /**
     * Checks if the given node is projecting to this node
     */
    isProjectedBy(node: NodeElement): boolean;
    /**
     * Converts the node to a json object
     */
    toJSON(): {
        bias: number;
        type: NodeTypeEnum;
        squash: string;
        mask: number;
    };
    /**
     * @todo: Удалить тип any или сделать валидацию
     */
    static fromJSON(json: any): NodeElement;
}
export {};
