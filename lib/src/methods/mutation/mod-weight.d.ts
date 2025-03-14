import { IMutation } from "./index";
interface IMutationModWeight extends IMutation {
    min: number;
    max: number;
}
declare const modWeight: IMutationModWeight;
export default modWeight;
