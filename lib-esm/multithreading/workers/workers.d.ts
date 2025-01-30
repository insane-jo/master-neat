import NodeTestWorker from './node/testworker';
import BrowserTestWorker from './browser/testworker';
import { INetworkTrainingSetItem } from "../../architecture/network";
export declare enum EWokerMessageType {
    init = "init",
    iteration = "iteration"
}
export interface IWorkerInitMessage extends IWorkerMessage {
    dataSet: INetworkTrainingSetItem[];
    cost: string;
}
export interface IWorkerIterationMessage extends IWorkerMessage {
    network: any;
}
export interface IWorkerMessage {
    type: EWokerMessageType;
}
declare const workers: {
    node: {
        TestWorker: typeof NodeTestWorker;
    };
    browser: {
        TestWorker: typeof BrowserTestWorker;
    };
};
export default workers;
