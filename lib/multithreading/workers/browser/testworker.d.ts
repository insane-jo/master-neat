import Network, { INetworkTrainingSetItem } from "../../../architecture/network";
/*******************************************************************************
 WEBWORKER
 *******************************************************************************/
export default class BrowserTestWorker {
    url: string;
    worker: Worker;
    constructor(workerUrl: string, dataSet: INetworkTrainingSetItem[], cost: any);
    evaluate(network: Network): Promise<any>;
    terminate(): void;
}
