"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://stackoverflow.com/questions/30033096/what-is-lr-policy-in-caffe/30045244
var rate = {
    FIXED: function () {
        var func = function (baseRate) { return baseRate; };
        return func;
    },
    STEP: function (gamma, stepSize) {
        if (gamma === void 0) { gamma = 0.9; }
        if (stepSize === void 0) { stepSize = 100; }
        var func = function (baseRate, iteration) {
            return baseRate * Math.pow(gamma, Math.floor(iteration / stepSize));
        };
        return func;
    },
    EXP: function (gamma) {
        if (gamma === void 0) { gamma = 0.999; }
        var func = function (baseRate, iteration) {
            return baseRate * Math.pow(gamma, iteration);
        };
        return func;
    },
    INV: function (gamma, power) {
        if (gamma === void 0) { gamma = 0.001; }
        if (power === void 0) { power = 2; }
        var func = function (baseRate, iteration) {
            return baseRate * Math.pow(1 + gamma * iteration, -power);
        };
        return func;
    }
};
exports.default = rate;
//# sourceMappingURL=rate.js.map