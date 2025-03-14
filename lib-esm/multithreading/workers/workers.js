import NodeTestWorker from './node/testworker';
import BrowserTestWorker from './browser/testworker';
export var EWokerMessageType;
(function (EWokerMessageType) {
    EWokerMessageType["init"] = "init";
    EWokerMessageType["iteration"] = "iteration";
})(EWokerMessageType || (EWokerMessageType = {}));
var workers = {
    node: {
        TestWorker: NodeTestWorker
    },
    browser: {
        TestWorker: BrowserTestWorker
    }
};
export default workers;
//# sourceMappingURL=workers.js.map