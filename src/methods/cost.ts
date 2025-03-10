import {ICommonCollection} from "../types/common-collection";

export type ICostFunction = (target: number[], output: number[]) => number;
type ICostCollection = ICommonCollection<ICostFunction>;

// https://en.wikipedia.org/wiki/Loss_function
// Additional refs: Huber (https://en.wikipedia.org/wiki/Huber_loss), Focal Loss (https://arxiv.org/abs/1708.02002)
const cost: ICostCollection = {
  /**
   * Summary: Computes the binary cross-entropy loss between target and output.
   * Suitability Ranking:
   * - Classification (binary): 9/10
   * - Regression: 3/10
   */
  CROSS_ENTROPY: (target, output) => {
    let error: number = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      const ti = target[i];
      const oi = Math.max(output[i], 1e-15); // Avoid log(0)
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
  MSE: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
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
  BINARY: (target, output) => {
    let misses: number = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
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
  MAE: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
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
  MAPE: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      const ti = target[i];
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
  MSLE: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      const logTarget = Math.log(Math.max(target[i], 1e-15));
      const logOutput = Math.log(Math.max(output[i], 1e-15));
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
  HINGE: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
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
  SQUARED_HINGE: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      const margin = 1 - target[i] * output[i];
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
  HUBER: (target, output) => {
    let error = 0;
    const l = output.length;
    const delta = 1.0; // Common threshold
    for (let i = 0; i < l; i++) {
      const diff = Math.abs(target[i] - output[i]);
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
  LOG_COSH: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      const diff = target[i] - output[i];
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
  QUANTILE: (target, output) => {
    let error = 0;
    const l = output.length;
    const quantile = 0.5; // Median by default
    for (let i = 0; i < l; i++) {
      const diff = target[i] - output[i];
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
  KL_DIVERGENCE: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      const ti = Math.max(target[i], 1e-15);
      const oi = Math.max(output[i], 1e-15);
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
  FOCAL: (target, output) => {
    let error = 0;
    const l = output.length;
    const gamma = 2.0; // Focusing parameter
    for (let i = 0; i < l; i++) {
      const ti = target[i];
      const oi = Math.max(output[i], 1e-15);
      const pt = ti * oi + (1 - ti) * (1 - oi); // Probability of correct class
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
  DICE: (target, output) => {
    let intersection = 0;
    let union = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      const ti = target[i];
      const oi = output[i];

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
  COSINE: (target, output) => {
    let dot = 0;
    let normT = 0;
    let normO = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
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
  MSLAE: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      const diff = Math.log(Math.max(target[i], 1e-15)) - Math.log(Math.max(output[i], 1e-15));
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
  POISSON: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      const oi = Math.max(output[i], 1e-15);
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
  L1_MSE: (target, output) => {
    let error = 0;
    const l = output.length;
    const lambda = 0.01; // Regularization strength

    for (let i = 0; i < l; i++) {
      const oi = output[i];

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
  L2_MSE: (target, output) => {
    let error = 0;
    const l = output.length;
    const lambda = 0.01; // Regularization strength
    for (let i = 0; i < l; i++) {
      const oi = output[i];

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
  SMOOTH_L1: (target, output) => {
    let error = 0;
    const l = output.length;
    const beta = 1.0; // Threshold
    for (let i = 0; i < l; i++) {
      const diff = Math.abs(target[i] - output[i]);
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
  IOU: (target, output) => {
    let intersection = 0;
    let union = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
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
  TVERSKY: (target, output) => {
    let intersection = 0;
    let fp = 0;
    let fn = 0;
    const l = output.length;
    const alpha = 0.3; // Weight for false positives
    const beta = 0.7;  // Weight for false negatives
    for (let i = 0; i < l; i++) {
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
  WASSERSTEIN: (target, output) => {
    let error = 0;
    const l = output.length;
    const sortedTarget = [...target].sort((a, b) => a - b);
    const sortedOutput = [...output].sort((a, b) => a - b);
    for (let i = 0; i < l; i++) {
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
  CATEGORICAL_CROSS_ENTROPY: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      error -= target[i] * Math.log(Math.max(output[i], 1e-15));
    }
    return error / l;
  },

  /**
   Summary: Computes the Margin Ranking Loss for ranking tasks.
   Suitability Ranking:
   Ranking: 9/10
   Classification: 7/10
   Regression: 5/10
   */
  RANKING: (target, output) => {
    let error = 0;
    const l = output.length / 2; // Assumes pairs
    const margin = 1.0;
    for (let i = 0; i < l; i++) {
      const x1 = output[2 * i];
      const x2 = output[2 * i + 1];
      const y = target[i] === 1 ? 1 : -1; // Assumes target is 1 or 0
      error += Math.max(0, -y * (x1 - x2) + margin);
    }
    return error / l;
  },
};

export default cost;
