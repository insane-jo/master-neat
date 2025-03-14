import { IMutation } from "./index";
interface IMutationSwapNodes extends IMutation {
    mutateOutput: boolean;
}
declare const swapNodes: IMutationSwapNodes;
export default swapNodes;
