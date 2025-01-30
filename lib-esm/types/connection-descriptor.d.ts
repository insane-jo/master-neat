import NodeElement from "../architecture/node";
import Connection from "../architecture/connection";
export interface IConnectionDescriptor {
    in: (NodeElement | Connection)[];
    out: (NodeElement | Connection)[];
    self: (NodeElement | Connection)[];
    gated?: Connection[];
}
