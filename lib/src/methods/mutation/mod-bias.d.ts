import { IMutation } from "./index";
import NodeElement from "../../architecture/node";
export interface IMutationModBias extends IMutation {
    min: number;
    max: number;
    mutateNode: (node: NodeElement) => void;
}
declare const modBias: IMutationModBias;
export default modBias;
