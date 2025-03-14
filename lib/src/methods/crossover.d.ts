import { ICommonCollection } from "../types/common-collection";
export interface ICrossover {
    name: string;
    config?: number[];
}
type ICrossoverCollection = ICommonCollection<ICrossover>;
declare const crossover: ICrossoverCollection;
export default crossover;
