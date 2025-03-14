import NodeElement from './node';
type IXTrace = {
    nodes: NodeElement[];
    values: number[];
};
export default class Connection {
    from: NodeElement;
    to: NodeElement;
    gain: number;
    weight: number;
    elegibility: number;
    previousDeltaWeight: number;
    totalDeltaWeight: number;
    gater: NodeElement | null;
    xtrace: IXTrace;
    constructor(from: NodeElement, to: NodeElement, weight?: number);
    toJSON(): {
        weight: number;
    };
    static innovationID(a: number, b: number): number;
}
export {};
