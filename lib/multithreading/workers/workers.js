"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EWokerMessageType = void 0;
var testworker_1 = __importDefault(require("./node/testworker"));
var testworker_2 = __importDefault(require("./browser/testworker"));
var EWokerMessageType;
(function (EWokerMessageType) {
    EWokerMessageType["init"] = "init";
    EWokerMessageType["iteration"] = "iteration";
})(EWokerMessageType || (exports.EWokerMessageType = EWokerMessageType = {}));
var workers = {
    node: {
        TestWorker: testworker_1.default
    },
    browser: {
        TestWorker: testworker_2.default
    }
};
exports.default = workers;
//# sourceMappingURL=workers.js.map