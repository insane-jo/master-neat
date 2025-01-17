import NodeTestWorker from './node/testworker';
import BrowserTestWorker from './browser/testworker';
import {INetworkTrainingSetItem} from "../../architecture/network";

export enum EWokerMessageType {
  init = 'init',
  iteration = 'iteration',
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

const workers = {
  node: {
    TestWorker: NodeTestWorker
  },
  browser: {
    TestWorker: BrowserTestWorker
  }
};

export default workers;
