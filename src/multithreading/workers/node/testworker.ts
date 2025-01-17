import cp from 'child_process';
import path from 'path';
import Network, {INetworkTrainingSetItem} from '../../../architecture/network';
import {ICostFunction} from "../../../methods/cost";
import {EWokerMessageType, IWorkerInitMessage, IWorkerIterationMessage} from "../workers";

export default class NodeTestWorker {
  public worker: cp.ChildProcess;

  // @todo: выкосить any
  constructor(dataSet: INetworkTrainingSetItem[], cost: ICostFunction) {
    if (typeof require !== 'undefined' && '.ts' in eval('require.extensions')) {
      this.worker = cp.fork(path.join(__dirname, '/worker.ts'), [], { execArgv: ['-r', 'ts-node/register'] });
    } else {
      this.worker = cp.fork(path.join(process.env.PWD as string, './dist/worker.js'));
    }

    const msgPayload: IWorkerInitMessage = {
      type: EWokerMessageType.init,
      dataSet: dataSet,
      cost: cost.name
    };

    this.worker.send(msgPayload);
  }

  evaluate(network: Network): Promise<any> {
    return new Promise((resolve) => {
      const msgPayload: IWorkerIterationMessage = {
        type: EWokerMessageType.iteration,
        network: network.toJSON()
      };

      var _that = this.worker;
      this.worker.on('message', function callback(e) {
        _that.removeListener('message', callback);
        resolve(e);
      });

      this.worker.send(msgPayload);
    });
  }

  terminate() {
    this.worker.kill();
  }
}
