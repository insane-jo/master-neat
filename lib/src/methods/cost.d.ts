import { ICommonCollection } from "../types/common-collection";
export type ICostFunction = (target: number[], output: number[]) => number;
type ICostCollection = ICommonCollection<ICostFunction>;
declare const cost: ICostCollection;
export default cost;
