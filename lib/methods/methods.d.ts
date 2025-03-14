declare const _default: {
    activation: import("../types/activation-types").IActivationCollection;
    mutation: {
        [key: string]: import("./mutation").IMutation[];
    };
    selection: {
        [key: string]: import("./selection").ISelection;
    };
    crossover: {
        [key: string]: import("./crossover").ICrossover;
    };
    cost: {
        [key: string]: import("./cost").ICostFunction;
    };
    gating: import("../types/methods-gating-types").IGateCollection;
    connection: import("../types/methods-collection-types").IConncetionCollection;
    rate: {
        [key: string]: () => import("./rate").IRateFunction;
    };
};
export default _default;
