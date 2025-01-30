import { ICommonCollection } from "./common-collection";
export interface IGate {
    name: string;
}
export type IGateCollection = ICommonCollection<IGate>;
