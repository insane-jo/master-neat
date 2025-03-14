import { EWokerMessageType } from "../workers";
/*******************************************************************************
 WEBWORKER
 *******************************************************************************/
var BrowserTestWorker = /** @class */ (function () {
    function BrowserTestWorker(workerUrl, dataSet, cost) {
        this.url = workerUrl;
        this.worker = new Worker(this.url);
        var msgPayload = {
            type: EWokerMessageType.init,
            dataSet: dataSet,
            cost: cost.name
        };
        this.worker.postMessage(msgPayload);
    }
    BrowserTestWorker.prototype.evaluate = function (network) {
        var _this = this;
        return new Promise(function (resolve) {
            var msgPayload = {
                type: EWokerMessageType.iteration,
                network: network.toJSON()
            };
            _this.worker.onmessage = function (e) {
                var error = new Float64Array(e.data.buffer)[0];
                resolve(error);
            };
            _this.worker.postMessage(msgPayload);
        });
    };
    BrowserTestWorker.prototype.terminate = function () {
        this.worker.terminate();
        window.URL.revokeObjectURL(this.url);
    };
    return BrowserTestWorker;
}());
export default BrowserTestWorker;
//# sourceMappingURL=testworker.js.map