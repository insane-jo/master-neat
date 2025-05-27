import cp from 'child_process';
import path from 'path';
import {INetworkTrainingSetItem} from '../../src/architecture/network';
import {EWokerMessageType, IWorkerIterationMessage} from "../../src/multithreading/workers/workers";
import {IWorkerMessage} from "../../src/multithreading/workers/workers";
import {CandleData} from "../common/generate-bars-data";
import CustomNetwork from "./custom-network-test";

export interface IWorkerInitMessage extends IWorkerMessage {
  dataSet: INetworkTrainingSetItem[];
  pointsPerIteration: number;
  bars: CandleData[];
}

export default class CustomNodeTestWorker {
  public worker: cp.ChildProcess;

  constructor(dataSet: INetworkTrainingSetItem[], pointsPerIteration: number, bars: CandleData[]) {
    if (typeof require !== 'undefined' && '.ts' in eval('require.extensions')) {
      this.worker = cp.fork(path.join(__dirname, '/custom-worker.ts'), [], { execArgv: ['-r', 'ts-node/register'] });
    } else {
      // this.worker = cp.fork(path.join(process.env.PWD as string, '../../../../dist/worker'));
      console.log('CURRENT FILE', __dirname, __filename);
      this.worker = cp.fork(path.join(__dirname, './worker'));
    }

    const msgPayload: IWorkerInitMessage = {
      type: EWokerMessageType.init,
      dataSet: dataSet,
      pointsPerIteration,
      bars
    };

    this.worker.send(msgPayload);
  }

  evaluate(network: CustomNetwork): Promise<any> {
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
