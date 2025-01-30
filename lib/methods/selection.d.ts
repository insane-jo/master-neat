import { ICommonCollection } from "../types/common-collection";
export type ISelection = {
    name: string;
    power?: number;
    size?: number;
    probability?: number;
};
type ISelectionsCollection = ICommonCollection<ISelection>;
declare const selection: ISelectionsCollection;
export default selection;
