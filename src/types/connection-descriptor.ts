import Connection from "../architecture/connection";

export interface IConnectionDescriptor {
  in: Connection[];
  out: Connection[];
  self: Connection[];
  gated?: Connection[];
}
