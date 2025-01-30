"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = __importDefault(require("child_process"));
var path_1 = __importDefault(require("path"));
var workers_1 = require("../workers");
var NodeTestWorker = /** @class */ (function () {
    function NodeTestWorker(dataSet, cost) {
        if (typeof require !== 'undefined' && '.ts' in eval('require.extensions')) {
            this.worker = child_process_1.default.fork(path_1.default.join(__dirname, '/worker.ts'), [], { execArgv: ['-r', 'ts-node/register'] });
        }
        else {
            // this.worker = cp.fork(path.join(process.env.PWD as string, '../../../../dist/worker'));
            console.log('CURRENT FILE', __dirname, __filename);
            this.worker = child_process_1.default.fork(path_1.default.join(__dirname, './worker'));
        }
        var msgPayload = {
            type: workers_1.EWokerMessageType.init,
            dataSet: dataSet,
            cost: cost.name
        };
        this.worker.send(msgPayload);
    }
    NodeTestWorker.prototype.evaluate = function (network) {
        var _this = this;
        return new Promise(function (resolve) {
            var msgPayload = {
                type: workers_1.EWokerMessageType.iteration,
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
exports.default = NodeTestWorker;
//# sourceMappingURL=testworker.js.map