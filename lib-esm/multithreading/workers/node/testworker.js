import cp from 'child_process';
import path from 'path';
import { EWokerMessageType } from "../workers";
var NodeTestWorker = /** @class */ (function () {
    // @todo: выкосить any
    function NodeTestWorker(dataSet, cost) {
        if (typeof require !== 'undefined' && '.ts' in eval('require.extensions')) {
            this.worker = cp.fork(path.join(__dirname, '/worker.ts'), [], { execArgv: ['-r', 'ts-node/register'] });
        }
        else {
            this.worker = cp.fork(path.join(process.env.PWD, './dist/worker.js'));
        }
        var msgPayload = {
            type: EWokerMessageType.init,
            dataSet: dataSet,
            cost: cost.name
        };
        this.worker.send(msgPayload);
    }
    NodeTestWorker.prototype.evaluate = function (network) {
        var _this = this;
        return new Promise(function (resolve) {
            var msgPayload = {
                type: EWokerMessageType.iteration,
                network: network.toJSON()
            };
            var _that = _this.worker;
            _this.worker.on('message', function callback(e) {
                _that.removeListener('message', callback);
                resolve(e);
            });
            _this.worker.send(msgPayload);
        });
    };
    NodeTestWorker.prototype.terminate = function () {
        this.worker.kill();
    };
    return NodeTestWorker;
}());
export default NodeTestWorker;
//# sourceMappingURL=testworker.js.map