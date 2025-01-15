import cp from 'child_process';
import path from 'path';
import Network from '../../../architecture/network';

export default class TestWorker {
  public worker: cp.ChildProcess;

  // @todo: выкосить any
  constructor(dataSet: any, cost: any) {
    this.worker = cp.fork(path.join(__dirname, '/worker'));

    this.worker.send({ set: dataSet, cost: cost.name });
  }

  evaluate (network: Network) {
    return new Promise((resolve, reject) => {
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
