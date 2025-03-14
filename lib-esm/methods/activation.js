var activation = {
    // Logistic Sigmoid: Maps to (0, 1), smooth gradient
    LOGISTIC: function (x, derivate) {
        var fx = 1 / (1 + Math.exp(-x));
        if (!derivate)
            return fx;
        return fx * (1 - fx);
    },
    // Hyperbolic Tangent: Maps to (-1, 1), zero-centered
    TANH: function (x, derivate) {
        if (derivate)
            return 1 - Math.pow(Math.tanh(x), 2);
        return Math.tanh(x);
    },
    // Identity: Linear, no transformation
    IDENTITY: function (x, derivate) {
        return derivate ? 1 : x;
    },
    // Step: Binary threshold at 0
    STEP: function (x, derivate) {
        return derivate ? 0 : x > 0 ? 1 : 0;
    },
    // ReLU: Rectified Linear Unit, combats vanishing gradient
    RELU: function (x, derivate) {
        if (derivate)
            return x > 0 ? 1 : 0;
        return x > 0 ? x : 0;
    },
    // Softsign: Smooth alternative to sign function
    SOFTSIGN: function (x, derivate) {
        var d = 1 + Math.abs(x);
        if (derivate)
            return x / Math.pow(d, 2);
        return x / d;
    },
    // Sinusoid: Periodic activation, rarely used practically
    SINUSOID: function (x, derivate) {
        if (derivate)
            return Math.cos(x);
        return Math.sin(x);
    },
    // Gaussian: Bell-shaped curve, used in RBF networks
    GAUSSIAN: function (x, derivate) {
        var d = Math.exp(-Math.pow(x, 2));
        if (derivate)
            return -2 * x * d;
        return d;
    },
    // Bent Identity: Non-linear with smooth curvature
    BENT_IDENTITY: function (x, derivate) {
        var d = Math.sqrt(Math.pow(x, 2) + 1);
        if (derivate)
            return x / (2 * d) + 1;
        return (d - 1) / 2 + x;
    },
    // Bipolar: Binary output ±1
    BIPOLAR: function (x, derivate) {
        return derivate ? 0 : x > 0 ? 1 : -1;
    },
    // Bipolar Sigmoid: Maps to (-1, 1), smooth like logistic
    BIPOLAR_SIGMOID: function (x, derivate) {
        var d = 2 / (1 + Math.exp(-x)) - 1;
        if (derivate)
            return (1 / 2) * (1 + d) * (1 - d);
        return d;
    },
    // Hard Tanh: Clipped Tanh, maps to [-1, 1]
    HARD_TANH: function (x, derivate) {
        if (derivate)
            return x > -1 && x < 1 ? 1 : 0;
        return Math.max(-1, Math.min(1, x));
    },
    // Absolute: Simple non-linearity, outputs positive values
    ABSOLUTE: function (x, derivate) {
        if (derivate)
            return x < 0 ? -1 : 1;
        return Math.abs(x);
    },
    // Inverse: Linear transformation, rarely used standalone
    INVERSE: function (x, derivate) {
        if (derivate)
            return -1;
        return 1 - x;
    },
    // SELU: Self-Normalizing, from Klambauer et al. (2017)
    SELU: function (x, derivate) {
        var alpha = 1.6732632423543772848170429916717;
        var scale = 1.0507009873554804934193349852946;
        var fx = x > 0 ? x : alpha * Math.exp(x) - alpha;
        if (derivate)
            return x > 0 ? scale : scale * (fx + alpha);
        return scale * fx;
    },
    // Leaky ReLU: Allows small gradient when x < 0
    LEAKY_RELU: function (x, derivate) {
        var alpha = 0.01; // Common default slope
        if (derivate)
            return x > 0 ? 1 : alpha;
        return x > 0 ? x : alpha * x;
    },
    // Parametric ReLU (PReLU): Learnable slope for x < 0
    PRELU: function (x, derivate, alpha) {
        if (alpha === void 0) { alpha = 0.25; }
        if (derivate)
            return x > 0 ? 1 : alpha;
        return x > 0 ? x : alpha * x;
    },
    // Exponential Linear Unit (ELU): Smooth for x < 0
    ELU: function (x, derivate) {
        var alpha = 1.0; // Common default
        if (derivate)
            return x > 0 ? 1 : alpha * Math.exp(x);
        return x > 0 ? x : alpha * (Math.exp(x) - 1);
    },
    // Swish: Google’s smooth, non-monotonic activation (Prajit et al., 2017)
    SWISH: function (x, derivate) {
        var fx = x / (1 + Math.exp(-x));
        if (derivate) {
            var sigmoid = 1 / (1 + Math.exp(-x));
            return fx + sigmoid * (1 - fx);
        }
        return fx;
    },
    // Softplus: Smooth approximation of ReLU
    SOFTPLUS: function (x, derivate) {
        var fx = Math.log(1 + Math.exp(x));
        if (derivate)
            return 1 / (1 + Math.exp(-x));
        return fx;
    },
    // Mish: Self-regularized, from Misra (2019)
    MISH: function (x, derivate) {
        var fx = x * Math.tanh(Math.log(1 + Math.exp(x)));
        if (derivate) {
            var omega = Math.exp(3 * x) + 4 * Math.exp(2 * x) + (6 + 4 * x) * Math.exp(x) + 4 * (1 + x);
            var delta = Math.pow(1 + Math.exp(x), 2);
            return Math.exp(x) * omega / delta;
        }
        return fx;
    },
    // GELU: Gaussian Error Linear Unit, used in Transformers (Hendrycks & Gimpel, 2016)
    GELU: function (x, derivate) {
        var cdf = 0.5 * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * Math.pow(x, 3))));
        if (derivate) {
            var pdf = Math.exp(-Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);
            return cdf + x * pdf;
        }
        return x * cdf;
    },
    // ArcTan: Maps to (-π/2, π/2), smooth and bounded
    ARCTAN: function (x, derivate) {
        if (derivate)
            return 1 / (1 + Math.pow(x, 2));
        return Math.atan(x);
    },
    // Sinc: Oscillatory function, used experimentally
    SINC: function (x, derivate) {
        if (derivate)
            return x === 0 ? 0 : (Math.cos(x) - Math.sin(x) / x) / x;
        return x === 0 ? 1 : Math.sin(x) / x;
    },
    // Soft Clipping: Logistic-like with clipping
    SOFT_CLIPPING: function (x, derivate) {
        var alpha = 0.5; // Adjustable parameter
        var fx = (1 / alpha) * Math.tanh(alpha * x);
        if (derivate)
            return 1 - Math.pow(fx, 2);
        return fx;
    },
    // Exponential: Simple unbounded non-linearity
    EXPONENTIAL: function (x, derivate) {
        var fx = Math.exp(x);
        return fx;
    },
    // Cube: Polynomial activation, x^3
    CUBE: function (x, derivate) {
        if (derivate)
            return 3 * Math.pow(x, 2);
        return Math.pow(x, 3);
    },
    // Square: Polynomial activation, x^2, simple non-linearity
    SQUARE: function (x, derivate) {
        if (derivate)
            return 2 * x;
        return Math.pow(x, 2);
    },
    // Clipped ReLU: Bounded ReLU, caps output at a maximum value
    CLIPPED_RELU: function (x, derivate) {
        var cap = 6; // Common default cap, adjustable
        if (derivate)
            return x > 0 && x < cap ? 1 : 0;
        return Math.min(Math.max(x, 0), cap);
    },
    // Thresholded ReLU: ReLU with a shifted threshold
    THRESHOLDED_RELU: function (x, derivate) {
        var theta = 1; // Default threshold, adjustable
        if (derivate)
            return x > theta ? 1 : 0;
        return x > theta ? x : 0;
    },
    // Logit: Inverse of sigmoid, maps (0, 1) to (-∞, ∞)
    LOGIT: function (x, derivate) {
        // Clamp x to avoid domain errors (0 or 1)
        var clampedX = Math.max(1e-15, Math.min(x, 1 - 1e-15));
        if (derivate)
            return 1 / (clampedX * (1 - clampedX));
        return Math.log(clampedX / (1 - clampedX));
    },
    // Hard Sigmoid: A piecewise linear approximation to the sigmoid function.
    HARD_SIGMOID: function (x, derivate) {
        // Typically defined with a linear region between -2.5 and 2.5
        if (derivate) {
            return x > -2.5 && x < 2.5 ? 0.2 : 0;
        }
        if (x <= -2.5)
            return 0;
        if (x >= 2.5)
            return 1;
        return 0.2 * x + 0.5;
    },
    // Hard Swish: Used in efficient networks, defined as x * HardSigmoid(x)
    HARD_SWISH: function (x, derivate) {
        // First compute Hard Sigmoid and its derivative
        var hardSigmoid, dHardSigmoid;
        if (x <= -2.5) {
            hardSigmoid = 0;
            dHardSigmoid = 0;
        }
        else if (x >= 2.5) {
            hardSigmoid = 1;
            dHardSigmoid = 0;
        }
        else {
            hardSigmoid = 0.2 * x + 0.5;
            dHardSigmoid = 0.2;
        }
        if (derivate) {
            // derivative: HardSigmoid(x) + x * dHardSigmoid(x)
            return hardSigmoid + x * dHardSigmoid;
        }
        return x * hardSigmoid;
    },
    // ELiSH: Exponential Linear Sigmoid Squasher
    ELISH: function (x, derivate) {
        // f(x) = { x * sigmoid(x)            if x >= 0
        //        { (exp(x)-1)*sigmoid(x)       if x < 0
        var sigmoid = 1 / (1 + Math.exp(-x));
        if (derivate) {
            // For x >= 0: derivative = sigmoid(x) * (1 + x*(1-sigmoid(x)))
            // For x < 0: derivative = sigmoid(x)*((exp(x)-1)*(1-sigmoid(x)) + Math.exp(x))
            if (x >= 0) {
                return sigmoid * (1 + x * (1 - sigmoid));
            }
            else {
                return sigmoid * ((Math.exp(x) - 1) * (1 - sigmoid) + Math.exp(x));
            }
        }
        if (x >= 0) {
            return x * sigmoid;
        }
        else {
            return (Math.exp(x) - 1) * sigmoid;
        }
    }
};
export default activation;
//# sourceMappingURL=activation.js.map