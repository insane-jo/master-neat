import Network, {INetworkTrainingSetItem} from "../../../architecture/network";
import {EWokerMessageType, IWorkerInitMessage, IWorkerIterationMessage} from "../workers";

/*******************************************************************************
 WEBWORKER
 *******************************************************************************/

export default class BrowserTestWorker {
  url: string;
  worker: Worker;

  constructor(workerUrl: string, dataSet: INetworkTrainingSetItem[], cost: any) {
    this.url = workerUrl;
    this.worker = new Worker(this.url);

    const msgPayload: IWorkerInitMessage = {
      type: EWokerMessageType.init,
      dataSet: dataSet,
      cost: cost.name
    };

    this.worker.postMessage(msgPayload);
  }

  evaluate(network: Network): Promise<any> {
    return new Promise((resolve) => {
      const msgPayload: IWorkerIterationMessage = {
        type: EWokerMessageType.iteration,
        network: network.toJSON()
      };

      this.worker.onmessage = function (e) {
        var error = new Float64Array(e.data.buffer)[0];
        resolve(error);
      };

      this.worker.postMessage(msgPayload);
    });
  }

  terminate () {
    this.worker.terminate();
    window.URL.revokeObjectURL(this.url);
  }
}
