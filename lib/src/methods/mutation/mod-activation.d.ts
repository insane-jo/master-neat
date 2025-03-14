import { IMutation } from "./index";
import { IActivationFunction } from "../../types/activation-types";
import NodeElement from "../../architecture/node";
export interface IMutationModActivation extends IMutation {
    mutateOutput: boolean;
    allowed: IActivationFunction[];
    mutateNode: (node: NodeElement) => void;
}
declare const modActivation: IMutationModActivation;
export default modActivation;
