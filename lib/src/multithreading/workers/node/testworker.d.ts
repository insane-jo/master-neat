import cp from 'child_process';
import Network, { INetworkTrainingSetItem } from '../../../architecture/network';
import { ICostFunction } from "../../../methods/cost";
export default class NodeTestWorker {
    worker: cp.ChildProcess;
    constructor(dataSet: INetworkTrainingSetItem[], cost: ICostFunction);
    evaluate(network: Network): Promise<any>;
    terminate(): void;
}
