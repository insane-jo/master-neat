import { IMutation } from "./index";
interface IMutationSubNode extends IMutation {
    keep_gates: boolean;
}
declare const subNode: IMutationSubNode;
export default subNode;
