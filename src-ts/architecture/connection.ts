//const Node = require('./node');
import NodeElement from './node';

type IXTrace = {
  nodes: NodeElement[];
  values: number[];
};

export default class Connection {
  public from: NodeElement;
  public to: NodeElement;
  public gain: number = 1;
  public weight: number;

  public elegibility: number = 0;
  public previousDeltaWeight: number = 0;
  public totalDeltaWeight: number = 0;

  public gater: NodeElement | null = null;

  public xtrace: IXTrace = {
    nodes: [],
    values: []
  };

  constructor (from: NodeElement, to: NodeElement, weight?: number) {
    this.from = from;
    this.to = to;

    this.weight = (typeof weight === 'undefined') ? Math.random() * 0.2 - 0.1 : weight;
  }

  toJSON() {
    return {
        weight: this.weight
    };
  }

  static innovationID (a: number, b: number): number {
    return 1 / 2 * (a + b) * (a + b + 1) + b;
  }
}