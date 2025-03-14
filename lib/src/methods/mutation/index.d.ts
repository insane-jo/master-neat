import Network from "../../architecture/network";
export interface IMutation {
    name: string;
    callback: (network: Network) => void;
}
type IMutationCollection = {
    [key: string]: IMutation[];
};
declare const mutations: IMutationCollection;
export default mutations;
