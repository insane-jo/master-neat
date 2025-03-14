import { ICommonCollection } from "./common-collection";
export type IActivationFunction = (x: number, derivate?: boolean) => number;
export type IActivationCollection = ICommonCollection<IActivationFunction>;
