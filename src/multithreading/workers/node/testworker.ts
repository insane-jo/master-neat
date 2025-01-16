import cp from 'child_process';
import path from 'path';
import Network from '../../../architecture/network';
import {ICostFunction} from "../../../methods/cost";

export default class NodeTestWorker {
  public worker: cp.ChildProcess;

  // @todo: выкосить any
  constructor(dataSet: any, cost: ICostFunction) {
    if (typeof require !== 'undefined' && 'ts' in eval('require.extensions')) {
      this.worker = cp.fork(path.join(__dirname, '/worker'));
    } else {
      this.worker = cp.fork(path.join(process.env.PWD as string, './dist/worker.js'));
    }

    this.worker.send({ set: dataSet, cost: cost.name });
  }

  evaluate (network: Network): Promise<any> {
    return new Promise((resolve) => {
      var serialized = network.serialize();

      var data = {
        activations: serialized[0],
        states: serialized[1],
        conns: serialized[2]
      };

      var _that = this.worker;
      this.worker.on('message', function callback (e) {
        _that.removeListener('message', callback);
        resolve(e);
      });

      this.worker.send(data);
    });
  }

  terminate () {
    this.worker.kill();
  }
}
