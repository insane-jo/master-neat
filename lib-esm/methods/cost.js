var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// https://en.wikipedia.org/wiki/Loss_function
// Additional refs: Huber (https://en.wikipedia.org/wiki/Huber_loss), Focal Loss (https://arxiv.org/abs/1708.02002)
var cost = {
    /**
     * Summary: Computes the binary cross-entropy loss between target and output.
     * Suitability Ranking:
     * - Classification (binary): 9/10
     * - Regression: 3/10
     */
    CROSS_ENTROPY: function (target, output) {
        var error = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            var ti = target[i];
            var oi = Math.max(output[i], 1e-15); // Avoid log(0)
            error -= ti * Math.log(oi) + (1 - ti) * Math.log(1 - Math.max(oi, 1e-15));
        }
        return error / l;
    },
    /**
     * Summary: Computes the mean squared error between target and output.
     * Suitability Ranking:
     * - Regression: 9/10
     * - Classification: 5/10
     */
    MSE: function (target, output) {
        var error = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            error += Math.pow(target[i] - output[i], 2);
        }
        return error / l;
    },
    /**
     * Summary: Counts classification mistakes (0 or 1).
     * Suitability Ranking:
     * - Classification: 9/10
     * - Regression: 3/10
     */
    BINARY: function (target, output) {
        var misses = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            misses += Number(Math.round(target[i] * 2) !== Math.round(output[i] * 2));
        }
        return misses / l; // Normalized for consistency
    },
    /**
     * Summary: Computes the mean absolute error between target and output.
     * Suitability Ranking:
     * - Regression: 7/10
     * - Classification: 4/10
     */
    MAE: function (target, output) {
        var error = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            error += Math.abs(target[i] - output[i]);
        }
        return error / l;
    },
    /**
     Summary: Computes the mean absolute percentage error between target and output.
     Suitability Ranking:
     Regression: 8/10
     Classification: 2/10
     */
    MAPE: function (target, output) {
        var error = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            var ti = target[i];
            error += Math.abs((output[i] - ti) / Math.max(ti, 1e-15)); // Avoid division by zero
        }
        return error / l;
    },
    /**
     Summary: Computes the mean squared logarithmic error between target and output.
     Suitability Ranking:
     Regression: 8/10
     Classification: 2/10
     */
    MSLE: function (target, output) {
        var error = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            var logTarget = Math.log(Math.max(target[i], 1e-15));
            var logOutput = Math.log(Math.max(output[i], 1e-15));
            error += Math.pow(logTarget - logOutput, 2); // Corrected to squared difference
        }
        return error / l;
    },
    /**
     * Summary: Computes the hinge loss, suitable for binary classification.
     * Suitability Ranking:
     * - Classification (binary): 8/10
     * - Regression: 3/10
     */
    HINGE: function (target, output) {
        var error = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            error += Math.max(0, 1 - target[i] * output[i]); // Assumes target is ±1
        }
        return error / l; // Normalized
    },
    /**
     * Summary: Computes the squared hinge loss, a variant of hinge loss.
     * Suitability Ranking:
     * - Classification (binary): 8/10
     * - Regression: 3/10
     */
    SQUARED_HINGE: function (target, output) {
        var error = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            var margin = 1 - target[i] * output[i];
            error += Math.pow(Math.max(0, margin), 2);
        }
        return error / l;
    },
    /**
     * Summary: Computes the Huber loss, a combination of MSE and MAE.
     * Suitability Ranking:
     * - Regression: 8/10
     * - Classification: 4/10
     */
    HUBER: function (target, output) {
        var error = 0;
        var l = output.length;
        var delta = 1.0; // Common threshold
        for (var i = 0; i < l; i++) {
            var diff = Math.abs(target[i] - output[i]);
            error += diff <= delta ? 0.5 * Math.pow(diff, 2) : delta * diff - 0.5 * Math.pow(delta, 2);
        }
        return error / l;
    },
    /**
     * Summary: Computes the log-cosh loss, a smooth version of MSE.
     * Suitability Ranking:
     * - Regression: 7/10
     * - Classification: 3/10
     */
    LOG_COSH: function (target, output) {
        var error = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            var diff = target[i] - output[i];
            error += Math.log(Math.cosh(diff)); // log(cosh(x)) approximates |x| for large x
        }
        return error / l;
    },
    /**
     * Summary: Computes the quantile loss, a robust regression loss.
     * Suitability Ranking:
     * - Regression: 8/10
     * - Classification: 4/10
     */
    QUANTILE: function (target, output) {
        var error = 0;
        var l = output.length;
        var quantile = 0.5; // Median by default
        for (var i = 0; i < l; i++) {
            var diff = target[i] - output[i];
            error += diff >= 0 ? quantile * diff : (quantile - 1) * diff;
        }
        return error / l;
    },
    /**
     * Summary: Computes the Kullback-Leibler divergence loss.
     * Suitability Ranking:
     * - Regression: 6/10
     * - Classification: 8/10
     */
    KL_DIVERGENCE: function (target, output) {
        var error = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            var ti = Math.max(target[i], 1e-15);
            var oi = Math.max(output[i], 1e-15);
            error += ti * Math.log(ti / oi);
        }
        return error / l;
    },
    /**
     * Summary: Computes the binary focal loss, a variant of cross-entropy for imbalanced datasets.
     * Suitability Ranking:
     * - Classification (binary): 9/10
     * - Regression: 3/10
     */
    FOCAL: function (target, output) {
        var error = 0;
        var l = output.length;
        var gamma = 2.0; // Focusing parameter
        for (var i = 0; i < l; i++) {
            var ti = target[i];
            var oi = Math.max(output[i], 1e-15);
            var pt = ti * oi + (1 - ti) * (1 - oi); // Probability of correct class
            error -= Math.pow(1 - pt, gamma) * Math.log(pt);
        }
        return error / l;
    },
    /**
     Summary: Computes the Dice loss for segmentation tasks based on overlap.
     Suitability Ranking:
     Segmentation: 9/10
     Classification: 7/10
     Regression: 2/10
     */
    DICE: function (target, output) {
        var intersection = 0;
        var union = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            var ti = target[i];
            var oi = output[i];
            intersection += ti * oi;
            union += ti + oi;
        }
        return 1 - (2 * intersection + 1e-15) / (union + 1e-15); // Avoid division by zero
    },
    /**
     * Summary: Computes the cosine similarity loss between target and output.
     * Suitability Ranking:
     * - Regression: 6/10
     * - Classification: 3/10
     */
    COSINE: function (target, output) {
        var dot = 0;
        var normT = 0;
        var normO = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            dot += target[i] * output[i];
            normT += Math.pow(target[i], 2);
            normO += Math.pow(output[i], 2);
        }
        return 1 - dot / (Math.sqrt(normT) * Math.sqrt(normO) + 1e-15); // 1 - cosine similarity
    },
    /**
     Summary: Computes the mean squared logarithmic absolute error between target and output.
     Suitability Ranking:
     Regression: 8/10
     Classification: 2/10
     */
    MSLAE: function (target, output) {
        var error = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            var diff = Math.log(Math.max(target[i], 1e-15)) - Math.log(Math.max(output[i], 1e-15));
            error += Math.abs(diff);
        }
        return error / l;
    },
    /**
     * Summary: Computes the Poisson loss, suitable for count data.
     * Suitability Ranking:
     * - Regression: 7/10
     * - Classification: 3/10
     */
    POISSON: function (target, output) {
        var error = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            var oi = Math.max(output[i], 1e-15);
            error += oi - target[i] * Math.log(oi);
        }
        return error / l;
    },
    /**
     Summary: Computes the L1 regularized mean squared error between target and output.
     Suitability Ranking:
     Regression: 8/10
     Classification: 6/10
     */
    L1_MSE: function (target, output) {
        var error = 0;
        var l = output.length;
        var lambda = 0.01; // Regularization strength
        for (var i = 0; i < l; i++) {
            var oi = output[i];
            error += Math.pow(target[i] - oi, 2) + lambda * Math.abs(oi);
        }
        return error / l;
    },
    /**
     Summary: Computes the L2 regularized mean squared error between target and output.
     Suitability Ranking:
     Regression: 8/10
     Classification: 6/10
     */
    L2_MSE: function (target, output) {
        var error = 0;
        var l = output.length;
        var lambda = 0.01; // Regularization strength
        for (var i = 0; i < l; i++) {
            var oi = output[i];
            error += Math.pow(target[i] - oi, 2) + lambda * Math.pow(oi, 2);
        }
        return error / l;
    },
    /**
     Summary: Computes the smooth L1 loss, a differentiable version of Huber Loss.
     Suitability Ranking:
     Regression: 9/10
     Classification: 7/10
     */
    SMOOTH_L1: function (target, output) {
        var error = 0;
        var l = output.length;
        var beta = 1.0; // Threshold
        for (var i = 0; i < l; i++) {
            var diff = Math.abs(target[i] - output[i]);
            error += diff < beta ? 0.5 * diff * diff / beta : diff - 0.5 * beta;
        }
        return error / l;
    },
    /**
     Summary: Computes the Intersection over Union (IoU) loss for segmentation and bounding box regression tasks.
     Suitability Ranking:
     Segmentation: 9/10
     Classification: 7/10
     Regression: 8/10
     */
    IOU: function (target, output) {
        var intersection = 0;
        var union = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            intersection += Math.min(target[i], output[i]);
            union += target[i] + output[i] - Math.min(target[i], output[i]);
        }
        return 1 - intersection / (union + 1e-15);
    },
    /**
     Summary: Computes the Tversky loss, a generalization of Dice Loss for imbalanced segmentation tasks.
     Suitability Ranking:
     Segmentation: 9/10
     Classification: 7/10
     Regression: 6/10
     */
    TVERSKY: function (target, output) {
        var intersection = 0;
        var fp = 0;
        var fn = 0;
        var l = output.length;
        var alpha = 0.3; // Weight for false positives
        var beta = 0.7; // Weight for false negatives
        for (var i = 0; i < l; i++) {
            intersection += target[i] * output[i];
            fp += output[i] * (1 - target[i]);
            fn += target[i] * (1 - output[i]);
        }
        return 1 - (intersection + 1e-15) / (intersection + alpha * fp + beta * fn + 1e-15);
    },
    /**
     Summary: Computes the Wasserstein loss, also known as Earth Mover’s Distance, for measuring distribution distance.
     Suitability Ranking:
     Regression: 8/10
     Classification: 6/10
     GANs: 9/10
     */
    WASSERSTEIN: function (target, output) {
        var error = 0;
        var l = output.length;
        var sortedTarget = __spreadArray([], target, true).sort(function (a, b) { return a - b; });
        var sortedOutput = __spreadArray([], output, true).sort(function (a, b) { return a - b; });
        for (var i = 0; i < l; i++) {
            error += Math.abs(sortedTarget[i] - sortedOutput[i]);
        }
        return error / l;
    },
    /**
     * Summary: Computes the categorical focal loss, a variant of cross-entropy for multi-class imbalanced datasets.
     * Suitability Ranking:
     * - Classification (multi-class): 9/10
     * - Regression: 3/10
     */
    CATEGORICAL_CROSS_ENTROPY: function (target, output) {
        var error = 0;
        var l = output.length;
        for (var i = 0; i < l; i++) {
            error -= target[i] * Math.log(Math.max(output[i], 1e-15));
        }
        return Math.abs(error / l);
    },
    /**
     Summary: Computes the Margin Ranking Loss for ranking tasks.
     Suitability Ranking:
     Ranking: 9/10
     Classification: 7/10
     Regression: 5/10
     */
    RANKING: function (target, output) {
        var error = 0;
        var l = output.length / 2; // Assumes pairs
        var margin = 1.0;
        for (var i = 0; i < l; i++) {
            var x1 = output[2 * i];
            var x2 = output[2 * i + 1];
            var y = target[i] === 1 ? 1 : -1; // Assumes target is 1 or 0
            error += Math.max(0, -y * (x1 - x2) + margin);
        }
        return error / l;
    },
};
export default cost;
//# sourceMappingURL=cost.js.map