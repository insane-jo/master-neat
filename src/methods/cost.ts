import {ICommonCollection} from "../types/common-collection";

export type ICostFunction = (target: number[], output: number[]) => number;
type ICostCollection = ICommonCollection<ICostFunction>;

// https://en.wikipedia.org/wiki/Loss_function
// Additional refs: Huber (https://en.wikipedia.org/wiki/Huber_loss), Focal Loss (https://arxiv.org/abs/1708.02002)
const cost: ICostCollection = {
  // Cross Entropy Loss: For classification, measures probability divergence
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

  // Mean Squared Error: Quadratic loss for regression
  MSE: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      error += Math.pow(target[i] - output[i], 2);
    }
    return error / l;
  },

  // Binary Error: Counts classification mistakes (0 or 1)
  BINARY: (target, output) => {
    let misses: number = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      misses += Number(Math.round(target[i] * 2) !== Math.round(output[i] * 2));
    }
    return misses / l; // Normalized for consistency
  },

  // Mean Absolute Error: L1 loss, robust to outliers
  MAE: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      error += Math.abs(target[i] - output[i]);
    }
    return error / l;
  },

  // Mean Absolute Percentage Error: Relative error measure
  MAPE: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      const ti = target[i];
      error += Math.abs((output[i] - ti) / Math.max(ti, 1e-15)); // Avoid division by zero
    }
    return error / l;
  },

  // Mean Squared Logarithmic Error: Penalizes underestimation more
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

  // Hinge Loss: For SVMs and binary classifiers
  HINGE: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      error += Math.max(0, 1 - target[i] * output[i]); // Assumes target is ±1
    }
    return error / l; // Normalized
  },

  // Squared Hinge Loss: Quadratic penalty for hinge violations
  SQUARED_HINGE: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      const margin = 1 - target[i] * output[i];
      error += Math.pow(Math.max(0, margin), 2);
    }
    return error / l;
  },

  // Huber Loss: Combines MSE and MAE, robust to outliers
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

  // Log-Cosh Loss: Smooth approximation of absolute error
  LOG_COSH: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      const diff = target[i] - output[i];
      error += Math.log(Math.cosh(diff)); // log(cosh(x)) approximates |x| for large x
    }
    return error / l;
  },

  // Quantile Loss: For quantile regression
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

  // Kullback-Leibler Divergence: Measures distribution difference
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

  // Focal Loss: For imbalanced classification (Lin et al., 2017)
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

  // Dice Loss: For segmentation tasks, overlap-based
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

  // Cosine Similarity Loss: Measures angle between vectors
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

  // Mean Squared Logarithmic Absolute Error: Variant of MSLE
  MSLAE: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      const diff = Math.log(Math.max(target[i], 1e-15)) - Math.log(Math.max(output[i], 1e-15));
      error += Math.abs(diff);
    }
    return error / l;
  },

  // Poisson Loss: For count data regression
  POISSON: (target, output) => {
    let error = 0;
    const l = output.length;
    for (let i = 0; i < l; i++) {
      const oi = Math.max(output[i], 1e-15);
      error += oi - target[i] * Math.log(oi);
    }
    return error / l;
  },

  // L1 Regularized MSE: MSE with L1 penalty on outputs
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

  // L2 Regularized MSE: MSE with L2 penalty on outputs
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
   * Purpose: A variation of Huber Loss that’s differentiable everywhere, often used in object detection (e.g., Faster R-CNN).
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
   * IoU Loss (Intersection over Union Loss)
   * Purpose: Common in segmentation and bounding box regression tasks, complements your Dice Loss.
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
   * Tversky Loss
   * Purpose: A generalization of Dice Loss, useful for imbalanced segmentation tasks with adjustable penalties for false positives/negatives.
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
   * Wasserstein Loss (Earth Mover’s Distance)
   * Purpose: Measures the "distance" between distributions, popular in GANs and regression tasks.
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
   * Categorical Cross-Entropy (Multi-class Extension)
   * Purpose: Your current CROSS_ENTROPY is binary; this extends it to multi-class problems.
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
   * Margin Ranking Loss
   * Purpose: For ranking tasks (e.g., learning to rank pairs).
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
