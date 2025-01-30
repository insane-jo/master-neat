import Cost from "../../../src/methods/cost";
import Selection from "../../../src/methods/selection";
import Rate from "../../../src/methods/rate";
import Activation from "../../../src/methods/activation";
import Crossover from "../../../src/methods/crossover";
export declare enum EEvolveRunningState {
    Running = "Running",
    Stopped = "Stopped"
}
interface SettingsState {
    networkRedrawRate: number;
    costFunction: keyof typeof Cost;
    mutationRate: number;
    mutationAmount: number;
    selectionFunction: keyof typeof Selection;
    popsize: number;
    elitism: number;
    rateFunction: keyof typeof Rate;
    equal: boolean;
    clear: boolean;
    allowedMutations: {
        [key: string]: boolean;
    };
    allowedActivations: {
        [key: keyof typeof Activation]: boolean;
    };
    allowedCrossovers: {
        [key: keyof typeof Crossover]: boolean;
    };
    evolving: {
        networkDate: number;
    };
    evolveRunningState: EEvolveRunningState;
    changedSettings: (keyof SettingsState)[];
}
export declare const updateSetting: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    key: keyof SettingsState;
    value: any;
}, "settings/updateSetting">, updateAllowedCollection: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    collectionName: keyof SettingsState;
    collectionKey: string;
    collectionValue: boolean;
}, "settings/updateAllowedCollection">, startEvolve: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"settings/startEvolve">, stopEvolve: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"settings/stopEvolve">;
declare const _default: import("redux").Reducer<SettingsState>;
export default _default;
