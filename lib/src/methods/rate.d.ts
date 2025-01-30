import { ICommonCollection } from "../types/common-collection";
export type IRateFunction = (baseRate: number, iteration: number) => number;
type IRateFunctionBuilder = () => IRateFunction;
type IRateCollection = ICommonCollection<IRateFunctionBuilder>;
declare const rate: IRateCollection;
export default rate;
